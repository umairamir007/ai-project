import { Router } from "express";
import multer from "multer";
import { cloneVoice, generateSpeech } from "../controllers/miniMax.controller";
import { requireFirebaseAuth } from "../middlewares/requireFirebaseAuth";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /api/v1/minimax/clone
router.post("/clone", requireFirebaseAuth, upload.single("file"), cloneVoice);

router.post("/tts", generateSpeech);

export default router;
