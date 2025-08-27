// services/ElevenLabs/elevenLabsClient.ts
import axios from "axios";

const elevenClient = axios.create({
  baseURL: process.env.ELEVENLABS_API || "https://api.elevenlabs.io",
  timeout: 60_000,
});

elevenClient.interceptors.request.use((config) => {
  config.headers["xi-api-key"] = process.env.ELEVENLABS_API_KEY || "";
  config.headers["accept"] = config.headers["accept"] || "audio/mpeg";
  return config;
});

export default elevenClient;
