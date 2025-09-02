"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const fishAudio_controller_1 = require("../controllers/fishAudio.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
/**
 * Clone a voice model from a sample
 * POST /api/v1/fish/clone
 * body: { file: audioFile, name?: string }
 */
router.post("/clone", upload.single("file"), fishAudio_controller_1.cloneVoice);
/**
 * Generate speech from cloned voice
 * POST /api/v1/fish/tts
 * body: { text: "Hello world", voiceModelId: "xxx" }
 */
router.post("/tts", fishAudio_controller_1.generateSpeech);
exports.default = router;
