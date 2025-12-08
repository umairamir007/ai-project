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
exports.resetPasswordService = exports.forgotPasswordService = exports.refreshAccessTokenService = exports.loginUserService = exports.registerUserService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = require("../../../utils/AppError");
const JWTTokenHelper_1 = require("../../../utils/JWTTokenHelper");
const user_model_1 = __importDefault(require("../../../models/user.model"));
const constants_1 = require("../../../constants");
const mailer_1 = require("../../../utils/mailer");
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
// FORGOT PASSWORD SERVICE
const forgotPasswordService = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findOne({ email });
    if (user) {
        const resetToken = jsonwebtoken_1.default.sign({ id: user._id, email: user.email }, constants_1.RESET_PASSWORD_SECRET, { expiresIn: "1h" });
        const resetLink = `${constants_1.FRONTEND_URL}/reset-password?token=${resetToken}`;
        yield (0, mailer_1.sendMail)({
            to: email,
            subject: "Reset your Isai password",
            html: `<p>We received a request to reset your password.</p>
                   <p><a href="${resetLink}">Click here to reset it</a>. This link is valid for 1 hour.</p>
                   <p>If you did not request this, you can safely ignore this email.</p>`,
        });
    }
    return {
        message: "Reset link sent to your email if it exists.",
    };
});
exports.forgotPasswordService = forgotPasswordService;
// RESET PASSWORD SERVICE
const resetPasswordService = (resetToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(resetToken, constants_1.RESET_PASSWORD_SECRET);
    }
    catch (err) {
        throw new AppError_1.UnauthorizedError("Invalid or expired reset token.");
    }
    const user = yield user_model_1.default.findById(decoded.id);
    if (!user) {
        throw new AppError_1.NotFoundError("User not found.");
    }
    user.password = newPassword;
    yield user.save();
    return {
        message: "Password updated successfully. You can now sign in with your new password.",
    };
});
exports.resetPasswordService = resetPasswordService;
