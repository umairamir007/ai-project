import { Request, Response } from "express";
import {
  synthesizeTTS,
  getVoiceById,
  addVoice,
} from "../services/ElevenLabs/elevenLabs.service";

/**
 * Simple health check
 */
export async function health(_req: Request, res: Response) {
  res.json({ ok: true });
}

/**
 * Text → Speech
 * Streams ElevenLabs TTS audio back to frontend
 */
export async function tts(req: Request, res: Response) {
  try {
    const {
      text,
      voice_id,
      model_id = "eleven_monolingual_v1",
      output_format = "mp3_44100_128",
      optimize_streaming_latency = 0,
    } = req.body;

    if (!process.env.ELEVENLABS_API_KEY) {
      return res.status(500).json({ error: "ELEVENLABS_API_KEY missing" });
    }
    if (!text || !voice_id) {
      return res.status(400).json({ error: "text and voice_id are required" });
    }

    // Call service
    const elevenRes = await synthesizeTTS({
      text,
      voice_id,
      model_id,
      output_format,
      optimize_streaming_latency,
    });

    // Set headers
    res.setHeader("Content-Type", "audio/mpeg");
    if (elevenRes.headers["content-length"]) {
      res.setHeader("Content-Length", elevenRes.headers["content-length"]);
    }

    // Pipe audio to client
    elevenRes.data.pipe(res);
  } catch (err: any) {
    if (err?.response) {
      console.error("ElevenLabs error:", err.response.status, err.response.data);
      return res.status(err.response.status).send(err.response.data);
    }
    console.error("TTS request failed:", err?.message || err);
    return res.status(500).json({ error: "TTS failed" });
  }
}

/**
 * Get voice info by ID
 */
export async function voiceInfo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = await getVoiceById(id);
    res.json(data);
  } catch (err: any) {
    const status = err?.response?.status || 500;
    const data =
      err?.response?.data || { error: err.message || "Voice fetch failed" };
    res.status(status).send(data);
  }
}

/**
 * Upload a custom voice
 */
export async function voiceAdd(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ error: "audio file is required (field name: file)" });
    }

    const { name, description, labels } = req.body;
    const payload = await addVoice({
      name,
      description,
      labels,
      file: req.file,
    });

    res.status(201).json(payload);
  } catch (err: any) {
    const status = err?.response?.status || 500;
    const data =
      err?.response?.data || { error: err.message || "Add voice failed" };
    res.status(status).send(data);
  }
}
