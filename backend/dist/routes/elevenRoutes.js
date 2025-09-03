"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const elevenlabs_controller_1 = require("../controllers/elevenlabs.controller");
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
router.post("/tts", elevenlabs_controller_1.tts);
router.post("/stt", upload.single("file"), elevenlabs_controller_1.stt);
router.get("/voices", elevenlabs_controller_1.getVoices);
router.get("/voices/:id", elevenlabs_controller_1.voiceInfo);
router.post("/voices", upload.single("file"), elevenlabs_controller_1.voiceAdd);
exports.default = router;
