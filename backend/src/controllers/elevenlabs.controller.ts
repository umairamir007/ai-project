import { Request, Response } from "express";
import {
  getVoiceById,
  addVoice,
} from "../services/ElevenLabs/elevenLabs.service";
import { ElevenLabsClient } from "elevenlabs";
import { Readable } from "stream";

const client = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY!,
});

/**
 * Text → Speech
 * Streams ElevenLabs TTS audio back to frontend
 */
export async function tts(req: Request, res: Response) {
  try {
    const { text, voice_id } = req.body;
    if (!text || !voice_id) {
      return res.status(400).json({ error: "text and voice_id are required" });
    }

    // Force type to Web ReadableStream
    const webStream: any = await client.textToSpeech.convertAsStream(voice_id, {
      model_id: "eleven_turbo_v2", // optional
      text,
      output_format: "mp3_44100_128",
    });

    res.setHeader("Content-Type", "audio/mpeg");

    // ✅ Handle Web ReadableStream
    if (webStream && typeof webStream.getReader === "function") {
      const reader = webStream.getReader();
      const nodeStream = new Readable({
        async read() {
          const { done, value } = await reader.read();
          if (done) {
            this.push(null);
          } else {
            this.push(Buffer.from(value));
          }
        },
      });

      nodeStream.pipe(res);
      return;
    }

    // ✅ Handle Uint8Array or Buffer response
    if (webStream instanceof Uint8Array || Buffer.isBuffer(webStream)) {
      res.end(Buffer.from(webStream));
      return;
    }

    console.error("Unexpected TTS response:", webStream);
    res.status(500).json({ error: "Unexpected TTS response" });
  } catch (err: any) {
    console.error("TTS failed:", err.response?.data || err.message || err);
    res.status(500).json({ error: "TTS failed" });
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

export async function getVoices(_req: Request, res: Response) {
  try {
    const voices = await client.voices.getAll(); // only owned
    res.json(voices);
  } catch (err: any) {
    console.error("Failed to fetch voices:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch voices" });
  }
}

