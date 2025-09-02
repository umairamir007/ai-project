"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const miniMax_controller_1 = require("../controllers/miniMax.controller");
const requireFirebaseAuth_1 = require("../middlewares/requireFirebaseAuth");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
// POST /api/v1/minimax/clone
router.post("/clone", requireFirebaseAuth_1.requireFirebaseAuth, upload.single("file"), miniMax_controller_1.cloneVoice);
router.post("/tts", miniMax_controller_1.generateSpeech);
exports.default = router;
