
import express from "express";
import multer from "multer";
import { createProject, getProject } from "../controllers/project.controller";
import { protect } from "../middlewares/authMiddleware";


const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post(
    "/projects",
    protect,
    upload.single("voice"),
    createProject
);

router.get(
    "/projects",
    protect,
    getProject
);

export default router;
