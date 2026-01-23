
import express from "express";
import multer from "multer";
import { createProject, deleteProject, getProject, downloadProjectFile } from "../controllers/project.controller";
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

router.delete(
    "/projects/:id",
    protect,
    deleteProject
);

router.get(
    "/projects/download",
    protect,
    downloadProjectFile
);

export default router;
