"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const project_controller_1 = require("../controllers/project.controller");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
router.post("/projects", authMiddleware_1.protect, upload.single("voice"), project_controller_1.createProject);
router.get("/projects", project_controller_1.getProject);
exports.default = router;
