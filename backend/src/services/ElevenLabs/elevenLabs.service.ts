import FormData from "form-data";
import elevenClient from "./elevenLabsClient";

/**
 * Synthesize speech (returns an axios response with a stream/arraybuffer)
 */
export async function synthesizeTTS(args: {
    voice_id: string;
    text: string;
    model_id?: string;
    output_format?: string;
    optimize_streaming_latency?: number;
}) {
    const {
        voice_id,
        text,
        model_id,
        output_format = "mp3_44100_128",
        optimize_streaming_latency = 0,
    } = args;

    const url = `/v1/text-to-speech/${String(voice_id).trim()}`;
    try {
        const payload: any = {
            text,
            voice_settings: {
                stability: 0.3,
                similarity_boost: 0.75,
                style: 0,
                use_speaker_boost: true,
            },
        };

        if (model_id) payload.model_id = model_id;

        return await elevenClient.post<NodeJS.ReadableStream>(url, payload, {
            params: { optimize_streaming_latency, output_format },
            responseType: "stream",
            headers: { "content-type": "application/json" },
        });
    } catch (e: any) {
        if (e?.response) {
            console.error("POST", url, "failed:", e.response.status, e.response.data);
        } else {
            console.error("Network error calling", url, e?.message || e);
        }
        throw e;
    }
}

export async function getVoiceById(voice_id) {
    const res = await elevenClient.get(`/v1/voices/${voice_id}`);
    return res.data;
}

export async function addVoice({ name, description, labels, file }) {
    const form = new FormData();
    if (name) form.append("name", name);
    if (description) form.append("description", description);
    if (labels) form.append("labels", typeof labels === "string" ? labels : JSON.stringify(labels));

    // file.buffer is from multer memoryStorage
    form.append("files", file.buffer, { filename: file.originalname, contentType: file.mimetype });

    const res = await elevenClient.post("/v1/voices/add", form, {
        headers: form.getHeaders(), // includes correct multipart boundary
        maxBodyLength: Infinity,
        maxContentLength: Infinity,
    });

    return res.data;
}
