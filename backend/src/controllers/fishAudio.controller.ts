// backend/src/controllers/fish.controller.ts
import { Request, Response } from "express";
import axios from "axios";

interface TTSPayload {
    text: string;
    voice?: string;
    format?: "mp3" | "wav";
}

export async function generateSpeech(
    req: Request<{}, any, TTSPayload>,
    res: Response
) {
    const apiKey = process.env.FISH_AUDIO_API_KEY;
    const { text, voice = "default", format = "mp3" } = req.body;

    if (!text) {
        return res.status(400).json({ error: "Text is required" });
    }

    try {
        const response = await axios.post(
            "https://api.fish.audio/v1/tts",
            {
                text,
                voice_model: voice,
                format,
            },
            {
                headers: { Authorization: `Bearer ${apiKey}` },
                responseType: "arraybuffer",
                validateStatus: () => true, // don’t auto-throw
            }
        );

        // Detect if it's actually JSON (error) instead of audio
        const contentType = response.headers["content-type"];
        if (contentType?.includes("application/json")) {
            const errJson = JSON.parse(response.data.toString("utf8"));
            console.error("Fish Audio error:", errJson);
            return res.status(500).json({ error: errJson.message || "TTS failed" });
        }

        // Otherwise return audio
        res.setHeader(
            "Content-Type",
            format === "mp3" ? "audio/mpeg" : "audio/wav"
        );
        res.send(response.data);
    } catch (err: any) {
        console.error("Fish Audio TTS error:", err.message);
        res.status(500).json({ error: "TTS failed" });
    }
}
export async function cloneVoice(req, res) {
    const fileBuffer = req.file.buffer; // from multer
    const sampleAudio = fileBuffer.toString('base64'); // API may accept base64 or form-data

    try {
        const response = await axios.post(
            'https://api.fish.audio/v1/voice-clone',
            {
                audio: sampleAudio,
                model_name: req.body.name || 'my-voice',
            },
            {
                headers: { Authorization: `Bearer ${process.env.FISH_AUDIO_API_KEY}` },
            }
        );
        console.log("🚀 ~ cloneVoice ~ response:", response)

        res.json(response.data);
    } catch (error) {
        console.error('Fish Audio error:', error.response?.data || error.message);
        res.status(500).json({ error: 'Voice cloning failed' });
    }
}