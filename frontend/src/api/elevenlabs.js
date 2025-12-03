// frontend/src/api/elevenlabs.js
import httpClient from "../lib/httpClient";

export async function fetchVoices() {
  const res = await httpClient.get("/elevenlabs/voices");
  return res.data.voices; // voices is an array
}
