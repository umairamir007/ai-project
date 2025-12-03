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
exports.refreshAccessToken = exports.loginUser = exports.registerUser = void 0;
const validatePayload_1 = __importDefault(require("../utils/validatePayload"));
const AppError_1 = require("../utils/AppError");
const user_service_1 = require("../services/ElevenLabs/auth/user.service");
const auth_validation_1 = require("../validations/auth.validation");
// REGISTER CONTROLLER
const registerUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validatePayload_1.default)(auth_validation_1.registerUserSchema, req.body);
        const response = yield (0, user_service_1.registerUserService)(req.body);
        res.status(201).json(response);
    }
    catch (err) {
        next(new AppError_1.AppError(err.message, err.status || 500));
    }
});
exports.registerUser = registerUser;
// LOGIN CONTROLLER
const loginUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validatePayload_1.default)(auth_validation_1.loginUserSchema, req.body);
        const response = yield (0, user_service_1.loginUserService)(req.body);
        res.status(200).json(response);
    }
    catch (err) {
        next(new AppError_1.AppError(err.message, err.status || 500));
    }
});
exports.loginUser = loginUser;
// REFRESH TOKEN CONTROLLER
const refreshAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, validatePayload_1.default)(auth_validation_1.refreshTokenSchema, req.body);
        const { refreshToken } = req.body;
        const response = yield (0, user_service_1.refreshAccessTokenService)(refreshToken);
        res.status(200).json(response);
    }
    catch (err) {
        next(new AppError_1.AppError(err.message, err.status || 500));
    }
});
exports.refreshAccessToken = refreshAccessToken;
