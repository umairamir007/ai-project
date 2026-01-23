// controllers/project.controller.ts
import { Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express";
import { createProjectService, getProjectService } from "../services/ElevenLabs/project.service";
import { ACCESS_TOKEN_SECRET } from "../constants";


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

export const getProject = async (req: AuthenticatedRequest, res: Response) => {
    try {
        // Get token from cookies or Authorization header
        let token = req.cookies?.token || req.cookies?.accessToken || req.cookies?.authToken;
        
        // If no token in cookies, check Authorization header
        if (!token) {
            const authHeader = req.headers.authorization;
            if (authHeader && authHeader.startsWith("Bearer ")) {
                token = authHeader.split(" ")[1];
            }
        }
        
        if (!token) {
            return res.status(401).json({ error: "Token not found" });
        }

        // Verify token
        let decoded: any;
        try {
            if (!ACCESS_TOKEN_SECRET) {
                return res.status(500).json({ error: "Server configuration error: ACCESS_TOKEN_SECRET not set" });
            }
            decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
        } catch (err: any) {
            // If token was signed with old/different secret, user needs to login again
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: "Invalid token. Please login again." });
            }
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: "Token expired. Please login again." });
            }
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const userId = decoded.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const project = await getProjectService(userId);
        res.status(200).json({
            message: "Project fetched",
            project,
        });
    } catch (error: any) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
}