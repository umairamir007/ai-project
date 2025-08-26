import axios from "axios";

/**
 * Calls your local proxy which calls ElevenLabs.
 * Returns an ArrayBuffer (MP3 bytes).
 */
export default async function TextToSpeech({
  voice_id,
  text,
  model_id,
  output_format,
}) {
  if (!voice_id) throw new Error("Missing voice_id");
  if (!text || !text.trim()) throw new Error("Please enter some text");

  // In dev, /api is proxied by Vite. In prod, set VITE_API_BASE to your server URL.
  const API_BASE = import.meta.env.VITE_API_BASE || "/api";

  const r = await axios.post(
    `${API_BASE}/elevenlabs/tts`,
    {
      text,
      voice_id,
      model_id: model_id ?? "eleven_turbo_v2", // swap to eleven_multilingual_v2 for non-English
      output_format: output_format ?? "mp3_44100_128",
    },
    { responseType: "arraybuffer" }
  );

  return r.data; // ArrayBuffer
}
