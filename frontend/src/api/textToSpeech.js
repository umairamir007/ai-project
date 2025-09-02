// src/api/textToSpeech.js
import axios from "axios";

export async function TextToSpeech(text, voice_id, model_id) {
  try {
    const payload = { text, voice_id, output_format: "mp3" };

    if (model_id) {
      payload.model_id = model_id; // only include if explicitly passed
    }

    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE}/elevenlabs/tts`,
      payload,
      { responseType: "arraybuffer" }
    );

    console.log("Response headers:", res.headers);
    console.log("Response type:", res.headers["content-type"]);

    const blob = new Blob([res.data], { type: "audio/mpeg" });

    // If blob is too small, it's probably JSON error
    if (blob.size < 200) {
      const textErr = await blob.text();
      console.error("TTS error response:", textErr);
      throw new Error("Backend did not return audio");
    }
    return URL.createObjectURL(blob);
  } catch (err) {
    if (err.response) {
      console.error(
        "ElevenLabs error:",
        err.response.status,
        err.response.data
      );
      throw new Error(
        err.response.data?.error || `TTS failed (${err.response.status})`
      );
    }
    throw new Error(err.message || "TTS request failed");
  }
}
