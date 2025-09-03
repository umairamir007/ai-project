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
exports.tts = tts;
exports.stt = stt;
exports.voiceInfo = voiceInfo;
exports.voiceAdd = voiceAdd;
exports.getVoices = getVoices;
const elevenLabs_service_1 = require("../services/ElevenLabs/elevenLabs.service");
const stream_1 = require("stream");
const constants_1 = require("../constants");
/**
 * Text → Speech
 * Streams ElevenLabs TTS audio back to frontend
 */
function tts(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const { text, voice_id } = req.body;
            if (!text || !voice_id) {
                return res.status(400).json({ error: "text and voice_id are required" });
            }
            // Force type to Web ReadableStream
            const webStream = yield constants_1.client.textToSpeech.convertAsStream(voice_id, {
                model_id: "eleven_turbo_v2", // optional
                text,
                output_format: "mp3_44100_128",
            });
            res.setHeader("Content-Type", "audio/mpeg");
            // ✅ Handle Web ReadableStream
            if (webStream && typeof webStream.getReader === "function") {
                const reader = webStream.getReader();
                const nodeStream = new stream_1.Readable({
                    read() {
                        return __awaiter(this, void 0, void 0, function* () {
                            const { done, value } = yield reader.read();
                            if (done) {
                                this.push(null);
                            }
                            else {
                                this.push(Buffer.from(value));
                            }
                        });
                    },
                });
                nodeStream.pipe(res);
                return;
            }
            // ✅ Handle Uint8Array or Buffer response
            if (webStream instanceof Uint8Array || Buffer.isBuffer(webStream)) {
                res.end(Buffer.from(webStream));
                return;
            }
            console.error("Unexpected TTS response:", webStream);
            res.status(500).json({ error: "Unexpected TTS response" });
        }
        catch (err) {
            console.error("TTS failed:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message || err);
            res.status(500).json({ error: "TTS failed" });
        }
    });
}
/**
 * Speech → Text (STT)
 */
function stt(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e;
        console.log("Multer parsed file:", {
            fieldname: (_a = req.file) === null || _a === void 0 ? void 0 : _a.fieldname,
            originalname: (_b = req.file) === null || _b === void 0 ? void 0 : _b.originalname,
            mimetype: (_c = req.file) === null || _c === void 0 ? void 0 : _c.mimetype,
            size: (_d = req.file) === null || _d === void 0 ? void 0 : _d.size,
        });
        try {
            if (!req.file) {
                return res.status(400).json({ error: "audio file is required" });
            }
            const audioFile = new File([new Uint8Array(req.file.buffer)], req.file.originalname, { type: req.file.mimetype });
            const transcription = yield constants_1.client.speechToText.convert({
                file: audioFile,
                model_id: "scribe_v1",
                tag_audio_events: true,
                language_code: "eng",
                diarize: true,
            });
            res.json(transcription);
        }
        catch (err) {
            console.error("STT failed:", ((_e = err.response) === null || _e === void 0 ? void 0 : _e.data) || err.message || err);
            res.status(500).json({ error: "STT failed" });
        }
    });
}
/**
 * Get voice info by ID
 */
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
            const data = ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.data) || { error: err.message || "Voice fetch failed" };
            res.status(status).send(data);
        }
    });
}
/**
 * Upload a custom voice
 */
function voiceAdd(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            if (!req.file) {
                return res
                    .status(400)
                    .json({ error: "audio file is required (field name: file)" });
            }
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
            const data = ((_b = err === null || err === void 0 ? void 0 : err.response) === null || _b === void 0 ? void 0 : _b.data) || { error: err.message || "Add voice failed" };
            res.status(status).send(data);
        }
    });
}
function getVoices(_req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const voices = yield constants_1.client.voices.getAll(); // only owned
            res.json(voices);
        }
        catch (err) {
            console.error("Failed to fetch voices:", ((_a = err.response) === null || _a === void 0 ? void 0 : _a.data) || err.message);
            res.status(500).json({ error: "Failed to fetch voices" });
        }
    });
}
