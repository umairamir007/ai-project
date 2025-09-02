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
Object.defineProperty(exports, "__esModule", { value: true });
exports.health = health;
exports.tts = tts;
exports.voiceInfo = voiceInfo;
exports.voiceAdd = voiceAdd;
const elevenLabs_service_1 = require("../../services/ElevenLabs/elevenLabs.service");
function health(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        res.json({ ok: true });
    });
}
function tts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("🚀 ~ tts ~ req:", req);
        try {
            const { text, voice_id, model_id, output_format, optimize_streaming_latency, } = req.body;
            if (!process.env.ELEVENLABS_API_KEY)
                return res.status(500).json({ error: "ELEVENLABS_API_KEY missing" });
            if (!text || !voice_id)
                return res.status(400).json({ error: "text and voice_id are required" });
            console.log("🚀 ~ tts ~ elevenRes:");
            const elevenRes = yield (0, elevenLabs_service_1.synthesizeTTS)({
                text,
                voice_id,
                model_id,
                output_format,
                optimize_streaming_latency,
            });
            console.log("🚀 ~ tts ~ elevenRes:", elevenRes);
            res.setHeader("Content-Type", "audio/mpeg");
            if (elevenRes.headers["content-length"]) {
                res.setHeader("Content-Length", elevenRes.headers["content-length"]);
            }
            // Stream ElevenLabs audio to the client
            elevenRes.data.pipe(res);
        }
        catch (err) {
            if (err === null || err === void 0 ? void 0 : err.response) {
                console.error("ElevenLabs error:", err.response.status, err.response.data);
                return res.status(err.response.status).send(err.response.data);
            }
            console.error("TTS request failed:", (err === null || err === void 0 ? void 0 : err.message) || err);
            return res.status(500).json({ error: "TTS failed" });
        }
    });
}
function voiceInfo(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { id } = req.params;
            const data = yield (0, elevenLabs_service_1.getVoiceById)(id);
            res.json(data);
        }
        catch (err) {
            const status = ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
            const data = ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.data) || {
                error: err.message || "Voice fetch failed",
            };
            res.status(status).send(data);
        }
    });
}
function voiceAdd(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            if (!req.file)
                return res
                    .status(400)
                    .json({ error: "audio file is required (field name: file)" });
            const { name, description, labels } = req.body;
            const payload = yield (0, elevenLabs_service_1.addVoice)({
                name,
                description,
                labels,
                file: req.file,
            });
            res.status(201).json(payload);
        }
        catch (err) {
            const status = ((_a = err === null || err === void 0 ? void 0 : err.response) === null || _a === void 0 ? void 0 : _a.status) || 500;
            const data = ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.data) || {
                error: err.message || "Add voice failed",
            };
            res.status(status).send(data);
        }
    });
}
