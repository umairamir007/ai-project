"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// services/ElevenLabs/elevenLabsClient.ts
const axios_1 = __importDefault(require("axios"));
const elevenClient = axios_1.default.create({
    baseURL: process.env.ELEVENLABS_API || "https://api.elevenlabs.io",
    timeout: 60000,
});
elevenClient.interceptors.request.use((config) => {
    config.headers["xi-api-key"] = process.env.ELEVENLABS_API_KEY || "";
    config.headers["accept"] = config.headers["accept"] || "audio/mpeg";
    return config;
});
exports.default = elevenClient;
