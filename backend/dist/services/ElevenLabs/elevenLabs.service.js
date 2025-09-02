"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.synthesizeTTS = synthesizeTTS;
exports.getVoiceById = getVoiceById;
exports.addVoice = addVoice;
const form_data_1 = __importDefault(require("form-data"));
const elevenLabsClient_1 = __importDefault(require("./elevenLabsClient"));
/**
 * Synthesize speech (returns an axios response with a stream/arraybuffer)
 */
function synthesizeTTS(args) {
    return __awaiter(this, void 0, void 0, function* () {
        const { voice_id, text, model_id, output_format = "mp3_44100_128", optimize_streaming_latency = 0, } = args;
        const url = `/v1/text-to-speech/${String(voice_id).trim()}`;
        try {
            const payload = {
                text,
                voice_settings: {
                    stability: 0.3,
                    similarity_boost: 0.75,
                    style: 0,
                    use_speaker_boost: true,
                },
            };
            if (model_id)
                payload.model_id = model_id;
            return yield elevenLabsClient_1.default.post(url, payload, {
                params: { optimize_streaming_latency, output_format },
                responseType: "stream",
                headers: { "content-type": "application/json" },
            });
        }
        catch (e) {
            if (e === null || e === void 0 ? void 0 : e.response) {
                console.error("POST", url, "failed:", e.response.status, e.response.data);
            }
            else {
                console.error("Network error calling", url, (e === null || e === void 0 ? void 0 : e.message) || e);
            }
            throw e;
        }
    });
}
function getVoiceById(voice_id) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield elevenLabsClient_1.default.get(`/v1/voices/${voice_id}`);
        return res.data;
    });
}
function addVoice(_a) {
    return __awaiter(this, arguments, void 0, function* ({ name, description, labels, file }) {
        const form = new form_data_1.default();
        if (name)
            form.append("name", name);
        if (description)
            form.append("description", description);
        if (labels)
            form.append("labels", typeof labels === "string" ? labels : JSON.stringify(labels));
        // file.buffer is from multer memoryStorage
        form.append("files", file.buffer, { filename: file.originalname, contentType: file.mimetype });
        const res = yield elevenLabsClient_1.default.post("/v1/voices/add", form, {
            headers: form.getHeaders(), // includes correct multipart boundary
            maxBodyLength: Infinity,
            maxContentLength: Infinity,
        });
        return res.data;
    });
}
