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
exports.refreshAccessTokenService = exports.loginUserService = exports.registerUserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../../utils/AppError");
const JWTTokenHelper_1 = require("../../../utils/JWTTokenHelper");
const user_model_1 = __importDefault(require("../../../models/user.model"));
const constants_1 = require("../../../constants");
const registerUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, password, confirmPassword } = payload;
    // Check confirm password
    // if (password !== confirmPassword) {
    //     throw new ValidationError("Passwords do not match.");
    // }
    const existingUser = yield user_model_1.default.findOne({ email });
    if (existingUser) {
        throw new AppError_1.ValidationError("User already exists. Please login.");
    }
    const user = yield user_model_1.default.create({
        firstName,
        lastName,
        email,
        password,
        // confirmPassword,
    });
    return {
        message: "User registered successfully.",
        email: user.email,
    };
});
exports.registerUserService = registerUserService;
// LOGIN SERVICE
const loginUserService = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = payload;
    const user = yield user_model_1.default.findOne({ email });
    if (!user) {
        throw new AppError_1.NotFoundError("User not found. Please register first.");
    }
    // Compare password
    const isPasswordCorrect = yield user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new AppError_1.UnauthorizedError("Invalid email or password.");
    }
    const now = Math.floor(Date.now() / 1000);
    // Generate tokens
    const accessToken = (0, JWTTokenHelper_1.generateAccessToken)(user._id.toString());
    const refreshToken = (0, JWTTokenHelper_1.generateRefreshToken)(user._id.toString());
    return {
        message: "Logged in successfully.",
        email: user.email,
        accessToken: {
            token: accessToken,
            expiry: now + constants_1.ACCESS_TOKEN_DURATION,
        },
        refreshToken: {
            token: refreshToken,
            expiry: now + constants_1.REFRESH_TOKEN_DURATION,
        },
    };
});
exports.loginUserService = loginUserService;
// REFRESH TOKEN SERVICE
const refreshAccessTokenService = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = jsonwebtoken_1.default.verify(refreshToken, constants_1.REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err)
            throw new AppError_1.UnauthorizedError("Invalid or expired refresh token.");
        return decoded;
    });
    const user = yield user_model_1.default.findById(decoded.id);
    if (!user)
        throw new AppError_1.NotFoundError("User not found.");
    const now = Math.floor(Date.now() / 1000);
    const newAccessToken = (0, JWTTokenHelper_1.generateAccessToken)(user._id.toString());
    return {
        message: "Access token refreshed successfully.",
        accessToken: {
            token: newAccessToken,
            expiry: now + constants_1.ACCESS_TOKEN_DURATION,
        },
    };
});
exports.refreshAccessTokenService = refreshAccessTokenService;
