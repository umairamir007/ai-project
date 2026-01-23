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
exports.getProject = exports.createProject = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const project_service_1 = require("../services/ElevenLabs/project.service");
const constants_1 = require("../constants");
const createProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, text } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        const file = req.file;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        if (!file) {
            return res.status(400).json({ error: "Voice file is required" });
        }
        const project = yield (0, project_service_1.createProjectService)(userId, name, text, file);
        res.status(201).json({
            message: "Project created",
            project,
        });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
exports.createProject = createProject;
const getProject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        // Get token from cookies
        const token = ((_a = req.cookies) === null || _a === void 0 ? void 0 : _a.token) || ((_b = req.cookies) === null || _b === void 0 ? void 0 : _b.accessToken) || ((_c = req.cookies) === null || _c === void 0 ? void 0 : _c.authToken);
        if (!token) {
            return res.status(401).json({ error: "Token not found in cookies" });
        }
        // Verify token
        let decoded;
        try {
            if (!constants_1.ACCESS_TOKEN_SECRET) {
                return res.status(500).json({ error: "Server configuration error: ACCESS_TOKEN_SECRET not set" });
            }
            decoded = jsonwebtoken_1.default.verify(token, constants_1.ACCESS_TOKEN_SECRET);
        }
        catch (err) {
            // If token was signed with old/different secret, user needs to login again
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: "Invalid token. Please login again." });
            }
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: "Token expired. Please login again." });
            }
            return res.status(401).json({ error: "Invalid or expired token" });
        }
        const userId = decoded.id;
        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }
        const project = yield (0, project_service_1.getProjectService)(userId);
        res.status(200).json({
            message: "Project fetched",
            project,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});
exports.getProject = getProject;
