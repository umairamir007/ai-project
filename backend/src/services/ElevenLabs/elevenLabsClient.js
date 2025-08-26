import axios from "axios";

const elevenClient = axios.create({
  baseURL: process.env.ELEVENLABS_API || "https://api.elevenlabs.io",
  headers: {
    "xi-api-key": process.env.ELEVENLABS_API_KEY,
  },
  timeout: 60_000,
});

export default elevenClient;
