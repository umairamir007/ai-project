// controllers/project.controller.ts
import { Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import { createProjectService } from "../services/ElevenLabs/project.service";


export const createProject = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { name, text } = req.body;
        const userId = req.user?.id;
        const file = req.file;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!file) {
            return res.status(400).json({ error: "Voice file is required" });
        }

        const project = await createProjectService(
            userId,
            name,
            text,
            file
        );

        res.status(201).json({
            message: "Project created",
            project,
        });

    } catch (err: any) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
};
