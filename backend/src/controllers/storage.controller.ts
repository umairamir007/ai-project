// backend/src/controllers/storage.controller.ts
import type { Response } from "express";
import { adminBucket } from "../lib/firebaseAdmin";
import { randomUUID } from "crypto";
import { AuthenticatedRequest } from "../types/express";

export async function uploadAudio(req: AuthenticatedRequest, res: Response) {
    try {
        const uid = req.uid;
        if (!uid) return res.status(401).json({ error: "Missing uid" });

        const { cardText = "Vocalize" } = req.body;
        const f = req.file;                                    // 👈 typed
        if (!f) return res.status(400).json({ error: "file is required (field: file)" });

        const path = `${uid}/${cardText}/${Date.now()}_${f.originalname}`;
        const token = randomUUID();

        await adminBucket.file(path).save(f.buffer, {
            resumable: false,
            contentType: f.mimetype || "application/octet-stream",
            metadata: {
                metadata: { firebaseStorageDownloadTokens: token },
                cacheControl: "public,max-age=3600",
            },
        });

        const bucket = adminBucket.name;
        const encoded = encodeURIComponent(path);
        const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encoded}?alt=media&token=${token}`;

        res.json({ ok: true, path, downloadURL });
    } catch (e: any) {
        console.error("Upload failed:", e?.message || e);
        res.status(500).json({ error: "upload failed" });
    }
}
