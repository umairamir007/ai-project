import { Router } from "express";
import multer from "multer";
import {
  health,
  tts,
  voiceInfo,
  voiceAdd,
} from "../../controllers/ElevenLabs/elevenlabs.controller"; // <-- fixed

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.get("/health", health);
router.post("/tts", tts);
router.get("/voices/:id", voiceInfo);
router.post("/voices/add", upload.single("file"), voiceAdd);

export default router;
