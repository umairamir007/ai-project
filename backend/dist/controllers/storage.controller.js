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
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAudio = uploadAudio;
const firebaseAdmin_1 = require("../lib/firebaseAdmin");
const crypto_1 = require("crypto");
function uploadAudio(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const uid = req.uid;
            if (!uid)
                return res.status(401).json({ error: "Missing uid" });
            const { cardText = "Vocalize" } = req.body;
            const f = req.file; // 👈 typed
            if (!f)
                return res.status(400).json({ error: "file is required (field: file)" });
            const path = `${uid}/${cardText}/${Date.now()}_${f.originalname}`;
            const token = (0, crypto_1.randomUUID)();
            yield firebaseAdmin_1.adminBucket.file(path).save(f.buffer, {
                resumable: false,
                contentType: f.mimetype || "application/octet-stream",
                metadata: {
                    metadata: { firebaseStorageDownloadTokens: token },
                    cacheControl: "public,max-age=3600",
                },
            });
            const bucket = firebaseAdmin_1.adminBucket.name;
            const encoded = encodeURIComponent(path);
            const downloadURL = `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encoded}?alt=media&token=${token}`;
            res.json({ ok: true, path, downloadURL });
        }
        catch (e) {
            console.error("Upload failed:", (e === null || e === void 0 ? void 0 : e.message) || e);
            res.status(500).json({ error: "upload failed" });
        }
    });
}
