"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSpeech = generateSpeech;
exports.cloneVoice = cloneVoice;
// backend/src/controllers/minimax.controller.ts
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
function generateSpeech(req, // ✅ works now
res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const apiKey = process.env.MINIMAX_API_KEY;
        const groupId = process.env.MINIMAX_GROUP_ID;
        const { text, voice = "male-qn-qingse" } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }
        try {
            const response = yield axios_1.default.post(`https://api.minimaxi.chat/v1/t2a_v2?GroupId=${groupId}`, {
                model: "speech-01",
                text,
                voice_id: voice,
            }, {
                headers: { Authorization: `Bearer ${apiKey}` },
                responseType: "arraybuffer",
            });
            res.setHeader("Content-Type", "audio/mpeg");
            res.send(response.data);
        }
        catch (err) {
            console.error("MiniMax TTS error:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            res.status(500).json({ error: "TTS failed" });
        }
    });
}
function cloneVoice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        const apiKey = process.env.MINIMAX_API_KEY;
        const groupId = process.env.MINIMAX_GROUP_ID;
        const file = req.file;
        if (!file)
            return res.status(400).json({ error: "Audio file required" });
        try {
            // Upload
            const form = new form_data_1.default();
            form.append("purpose", "voice_clone");
            form.append("file", file.buffer, {
                filename: file.originalname,
                contentType: file.mimetype,
            });
            const uploadRes = yield axios_1.default.post(`https://api.minimaxi.chat/v1/files/upload?GroupId=${groupId}`, form, {
                headers: Object.assign(Object.assign({}, form.getHeaders()), { Authorization: `Bearer ${apiKey}` }),
            });
            const fileId = (_b = (_a = uploadRes.data) === null || _a === void 0 ? void 0 : _a.file) === null || _b === void 0 ? void 0 : _b.file_id;
            if (!fileId) {
                console.error("Upload failed:", uploadRes.data);
                return res.status(500).json({ error: "Upload to MiniMax failed" });
            }
            // Clone
            const cloneRes = yield axios_1.default.post(`https://api.minimaxi.chat/v1/voice_clone?GroupId=${groupId}`, { file_id: fileId, voice_id: `voice_${Date.now()}` }, { headers: { Authorization: `Bearer ${apiKey}` } });
            const status = (_d = (_c = cloneRes.data) === null || _c === void 0 ? void 0 : _c.base_resp) === null || _d === void 0 ? void 0 : _d.status_code;
            const voiceId = (_e = cloneRes.data) === null || _e === void 0 ? void 0 : _e.voice_id; // <--- real voice ID
            if (status !== 0 || !voiceId) {
                console.error("Clone failed:", cloneRes.data);
                return res.status(500).json({ error: "Voice clone failed", data: cloneRes.data });
            }
            res.json({ success: true, voiceId });
        }
        catch (err) {
            console.error("MiniMax cloning error:", ((_f = err.response) === null || _f === void 0 ? void 0 : _f.data) || err.message);
            res.status(500).json({ error: "Voice cloning failed" });
        }
    });
}
