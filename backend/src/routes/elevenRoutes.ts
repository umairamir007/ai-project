import express from "express";
import multer from "multer";
import { tts, stt, getVoices, voiceInfo, voiceAdd } from "../controllers/elevenlabs.controller";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/tts", tts);
router.post("/stt", upload.single("file"), stt);
router.get("/voices", getVoices);
router.get("/voices/:id", voiceInfo);
router.post("/voices", upload.single("file"), voiceAdd);

export default router;
