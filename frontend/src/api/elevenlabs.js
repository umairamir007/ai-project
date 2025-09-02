// frontend/src/api/elevenlabs.js
import axios from "axios";

export async function fetchVoices() {
  const res = await axios.get(
    `${import.meta.env.VITE_API_BASE}/elevenlabs/voices`
  );
  return res.data.voices; // voices is an array
}
