import { Router } from "express";
import multer from "multer";
import {
  tts,
  voiceInfo,
  voiceAdd,
  getVoices,
} from "../controllers/elevenlabs.controller";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post("/tts", tts);
router.get("/voices/:id", voiceInfo);
router.post("/voices/add", upload.single("file"), voiceAdd);
router.get("/voices", getVoices);

export default router;
