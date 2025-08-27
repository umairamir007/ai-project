import {
  synthesizeTTS,
  getVoiceById,
  addVoice,
} from "../../services/ElevenLabs/elevenLabs.service";

export async function health(_req, res) {
  res.json({ ok: true });
}

export async function tts(req, res) {
  console.log("🚀 ~ tts ~ req:", req)
  try {
    const {
      text,
      voice_id,
      model_id,
      output_format,
      optimize_streaming_latency,
    } = req.body;
    if (!process.env.ELEVENLABS_API_KEY)
      return res.status(500).json({ error: "ELEVENLABS_API_KEY missing" });
    if (!text || !voice_id)
      return res.status(400).json({ error: "text and voice_id are required" });

    console.log("🚀 ~ tts ~ elevenRes:")

    const elevenRes = await synthesizeTTS({
      text,
      voice_id,
      model_id,
      output_format,
      optimize_streaming_latency,
    });
    console.log("🚀 ~ tts ~ elevenRes:", elevenRes)

    res.setHeader("Content-Type", "audio/mpeg");
    if (elevenRes.headers["content-length"]) {
      res.setHeader("Content-Length", elevenRes.headers["content-length"]);
    }
    // Stream ElevenLabs audio to the client
    elevenRes.data.pipe(res);
  } catch (err) {
    if (err?.response) {
      console.error("ElevenLabs error:", err.response.status, err.response.data);
      return res.status(err.response.status).send(err.response.data);
    }
    console.error("TTS request failed:", err?.message || err);
    return res.status(500).json({ error: "TTS failed" });
  }
}

export async function voiceInfo(req, res) {
  try {
    const { id } = req.params;
    const data = await getVoiceById(id);
    res.json(data);
  } catch (err) {
    const status = err?.response?.status || 500;
    const data = err?.response?.data || {
      error: err.message || "Voice fetch failed",
    };
    res.status(status).send(data);
  }
}

export async function voiceAdd(req, res) {
  try {
    if (!req.file)
      return res
        .status(400)
        .json({ error: "audio file is required (field name: file)" });
    const { name, description, labels } = req.body;
    const payload = await addVoice({
      name,
      description,
      labels,
      file: req.file,
    });
    res.status(201).json(payload);
  } catch (err) {
    const status = err?.response?.status || 500;
    const data = err?.response?.data || {
      error: err.message || "Add voice failed",
    };
    res.status(status).send(data);
  }
}
