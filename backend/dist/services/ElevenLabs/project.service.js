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
exports.getProjectService = exports.createProjectService = void 0;
const project_model_1 = __importDefault(require("../../models/project.model"));
const AppError_1 = require("../../utils/AppError");
const digitalocean_1 = require("../../utils/digitalocean");
const createProjectService = (userId, name, text, file) => __awaiter(void 0, void 0, void 0, function* () {
    let voiceUrl = "";
    if (file) {
        voiceUrl = yield (0, digitalocean_1.uploadVoiceToSpaces)(file);
    }
    const project = yield project_model_1.default.create({
        userId,
        name,
        text,
        voice: voiceUrl,
    });
    return project;
});
exports.createProjectService = createProjectService;
const getProjectService = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield project_model_1.default.find({ userId });
    if (!projects) {
        throw new AppError_1.NotFoundError("No projects found");
    }
    return projects;
});
exports.getProjectService = getProjectService;
