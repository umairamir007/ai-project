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
exports.uploadVoiceToSpaces = void 0;
// utils/digitalocean.ts
const client_s3_1 = require("@aws-sdk/client-s3");
const uuid_1 = require("uuid");
const path_1 = __importDefault(require("path"));
const s3 = new client_s3_1.S3Client({
    region: "us-east-1", // DO uses nyc3, sgp1, etc., but AWS SDK requires region
    endpoint: process.env.DO_SPACES_ENDPOINT, // e.g. "https://sgp1.digitaloceanspaces.com"
    credentials: {
        accessKeyId: process.env.DO_SPACES_KEY,
        secretAccessKey: process.env.DO_SPACES_SECRET,
    }
});
const uploadVoiceToSpaces = (file) => __awaiter(void 0, void 0, void 0, function* () {
    const extension = path_1.default.extname(file.originalname);
    const filename = `voices/${(0, uuid_1.v4)()}${extension}`;
    yield s3.send(new client_s3_1.PutObjectCommand({
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: filename,
        Body: file.buffer,
        ACL: "public-read",
        ContentType: file.mimetype,
    }));
    return `${process.env.DO_SPACES_CDN}/${filename}`;
});
exports.uploadVoiceToSpaces = uploadVoiceToSpaces;
