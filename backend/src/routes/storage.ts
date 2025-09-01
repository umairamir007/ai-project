// backend/src/routes/storage.ts
import { Router } from "express";
import multer from "multer";
import { requireFirebaseAuth } from "../middlewares/requireFirebaseAuth";
import { uploadAudio } from "../controllers/storage.controller";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

router.post("/upload", requireFirebaseAuth, upload.single("file"), uploadAudio);

export default router;
