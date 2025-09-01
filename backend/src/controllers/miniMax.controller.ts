// backend/src/controllers/minimax.controller.ts
import axios from "axios";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../types/express";
import FormData from "form-data";

interface TTSRequestBody {
    text: string;
    voice?: string;
}

export async function generateSpeech(
    req: Request<{}, {}, TTSRequestBody>, // ✅ works now
    res: Response
) {
    const apiKey = process.env.MINIMAX_API_KEY;
    const groupId = process.env.MINIMAX_GROUP_ID;
    const { text, voice = "male-qn-qingse" } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    try {
        const response = await axios.post(
            `https://api.minimaxi.chat/v1/t2a_v2?GroupId=${groupId}`,
            {
                model: "speech-01",
                text,
                voice_id: voice,
            },
            {
                headers: { Authorization: `Bearer ${apiKey}` },
                responseType: "arraybuffer",
            }
        );

        res.setHeader("Content-Type", "audio/mpeg");
        res.send(response.data);
    } catch (err: any) {
        console.error("MiniMax TTS error:", err.response?.data || err.message);
        res.status(500).json({ error: "TTS failed" });
    }
}

export async function cloneVoice(req: AuthenticatedRequest, res: Response) {
    const apiKey = process.env.MINIMAX_API_KEY;
    const groupId = process.env.MINIMAX_GROUP_ID;
    const file = req.file;

    if (!file) return res.status(400).json({ error: "Audio file required" });

    try {
        // Upload
        const form = new FormData();
        form.append("purpose", "voice_clone");
        form.append("file", file.buffer, {
            filename: file.originalname,
            contentType: file.mimetype,
        });

        const uploadRes = await axios.post(
            `https://api.minimaxi.chat/v1/files/upload?GroupId=${groupId}`,
            form,
            {
                headers: {
                    ...form.getHeaders(),
                    Authorization: `Bearer ${apiKey}`,
                },
            }
        );

        const fileId = uploadRes.data?.file?.file_id;
        if (!fileId) {
            console.error("Upload failed:", uploadRes.data);
            return res.status(500).json({ error: "Upload to MiniMax failed" });
        }

        // Clone
        const cloneRes = await axios.post(
            `https://api.minimaxi.chat/v1/voice_clone?GroupId=${groupId}`,
            { file_id: fileId, voice_id: `voice_${Date.now()}` },
            { headers: { Authorization: `Bearer ${apiKey}` } }
        );

        const status = cloneRes.data?.base_resp?.status_code;
        const voiceId = cloneRes.data?.voice_id; // <--- real voice ID

        if (status !== 0 || !voiceId) {
            console.error("Clone failed:", cloneRes.data);
            return res.status(500).json({ error: "Voice clone failed", data: cloneRes.data });
        }

        res.json({ success: true, voiceId });
    } catch (err: any) {
        console.error("MiniMax cloning error:", err.response?.data || err.message);
        res.status(500).json({ error: "Voice cloning failed" });
    }
}
