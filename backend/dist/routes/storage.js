"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/storage.ts
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const requireFirebaseAuth_1 = require("../middlewares/requireFirebaseAuth");
const storage_controller_1 = require("../controllers/storage.controller");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
router.post("/upload", requireFirebaseAuth_1.requireFirebaseAuth, upload.single("file"), storage_controller_1.uploadAudio);
exports.default = router;
