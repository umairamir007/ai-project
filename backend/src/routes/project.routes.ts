
import express from "express";
import multer from "multer";
import { createProject } from "../controllers/project.controller";
import { protect } from "../middlewares/authMiddleware";


const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/projects",
    protect,
    upload.single("voice"),
    createProject
);

export default router;
