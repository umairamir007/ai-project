// server/index.js
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

const ELEVEN_API = "https://api.elevenlabs.io";
const API_KEY = process.env.ELEVENLABS_API_KEY;

app.post("/api/elevenlabs/tts", async (req, res) => {
  try {
    const {
      text,
      voice_id,
      model_id = "eleven_turbo_v2",
      output_format = "mp3_44100_128",
      optimize_streaming_latency = 0,
    } = req.body;
    if (!API_KEY)
      return res.status(500).json({ error: "Missing ELEVENLABS_API_KEY" });
    if (!text || !voice_id)
      return res.status(400).json({ error: "text and voice_id are required" });

    const url = `${ELEVEN_API}/v1/text-to-speech/${voice_id}`;
    const r = await axios.post(
      url,
      {
        text,
        model_id,
        voice_settings: {
          stability: 0.3,
          similarity_boost: 0.75,
          style: 0,
          use_speaker_boost: true,
        },
      },
      {
        params: { optimize_streaming_latency, output_format },
        responseType: "arraybuffer",
        headers: {
          "xi-api-key": API_KEY,
          accept: "audio/mpeg",
          "content-type": "application/json",
        },
      }
    );

    res.set("Content-Type", "audio/mpeg");
    res.send(Buffer.from(r.data));
  } catch (err) {
    const status = err?.response?.status || 500;
    res.status(status).send(err?.response?.data || { error: "TTS failed" });
  }
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => console.log(`Proxy on :${PORT}`));
