"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const elevenlabs_controller_1 = require("../../controllers/elevenlabs.controller"); // <-- fixed
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 20 * 1024 * 1024 },
});
router.get("/health", elevenlabs_controller_1.health);
router.post("/tts", elevenlabs_controller_1.tts);
router.get("/voices/:id", elevenlabs_controller_1.voiceInfo);
router.post("/voices/add", upload.single("file"), elevenlabs_controller_1.voiceAdd);
exports.default = router;
