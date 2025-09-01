import axios from "axios";

export async function TextToSpeech(text, voice_id) {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE}/elevenlabs/tts`,
    { text, voice_id },
    { responseType: "arraybuffer" }
  );

  // Convert to blob URL
  const blob = new Blob([res.data], { type: "audio/mpeg" });
  return URL.createObjectURL(blob);
}
