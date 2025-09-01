import { Router } from "express";
import multer from "multer";
import { cloneVoice, generateSpeech } from "../controllers/fishAudio.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * Clone a voice model from a sample
 * POST /api/v1/fish/clone
 * body: { file: audioFile, name?: string }
 */
router.post("/clone", upload.single("file"), cloneVoice);

/**
 * Generate speech from cloned voice
 * POST /api/v1/fish/tts
 * body: { text: "Hello world", voiceModelId: "xxx" }
 */
router.post("/tts", generateSpeech);

export default router;
