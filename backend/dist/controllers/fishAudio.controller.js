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
const axios_1 = __importDefault(require("axios"));
function generateSpeech(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiKey = process.env.FISH_AUDIO_API_KEY;
        const { text, voice = "default", format = "mp3" } = req.body;
        if (!text) {
            return res.status(400).json({ error: "Text is required" });
        }
        try {
            const response = yield axios_1.default.post("https://api.fish.audio/v1/tts", {
                text,
                voice_model: voice,
                format,
            }, {
                headers: { Authorization: `Bearer ${apiKey}` },
                responseType: "arraybuffer",
                validateStatus: () => true, // don’t auto-throw
            });
            // Detect if it's actually JSON (error) instead of audio
            const contentType = response.headers["content-type"];
            if (contentType === null || contentType === void 0 ? void 0 : contentType.includes("application/json")) {
                const errJson = JSON.parse(response.data.toString("utf8"));
                console.error("Fish Audio error:", errJson);
                return res.status(500).json({ error: errJson.message || "TTS failed" });
            }
            // Otherwise return audio
            res.setHeader("Content-Type", format === "mp3" ? "audio/mpeg" : "audio/wav");
            res.send(response.data);
        }
        catch (err) {
            console.error("Fish Audio TTS error:", err.message);
            res.status(500).json({ error: "TTS failed" });
        }
    });
}
function cloneVoice(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const fileBuffer = req.file.buffer; // from multer
        const sampleAudio = fileBuffer.toString('base64'); // API may accept base64 or form-data
        try {
            const response = yield axios_1.default.post('https://api.fish.audio/v1/voice-clone', {
                audio: sampleAudio,
                model_name: req.body.name || 'my-voice',
            }, {
                headers: { Authorization: `Bearer ${process.env.FISH_AUDIO_API_KEY}` },
            });
            console.log("🚀 ~ cloneVoice ~ response:", response);
            res.json(response.data);
        }
        catch (error) {
            console.error('Fish Audio error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
            res.status(500).json({ error: 'Voice cloning failed' });
        }
    });
}
