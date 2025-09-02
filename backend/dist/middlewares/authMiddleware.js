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
exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const constants_1 = require("../constants");
const AppError_1 = require("../utils/AppError");
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new AppError_1.UnauthorizedError("Authorization token missing or invalid.");
        }
        const accessToken = authHeader.split(" ")[1];
        const decoded = jsonwebtoken_1.default.verify(accessToken, constants_1.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err || !decoded) {
                throw new AppError_1.UnauthorizedError("Invalid or expired token.");
            }
            return decoded;
        });
        const userId = decoded.id;
        // const userId = "" //TODO: TEST OTHER USRES (remove for prod)
        const user = yield userModel_1.default.findById(userId).select("_id email");
        if (!user) {
            throw new AppError_1.NotFoundError("User not found.");
        }
        const effectiveRole = user.email === constants_1.ADMIN_EMAIL ? "Admin" : ((_a = user.role) !== null && _a !== void 0 ? _a : "User");
        req.user = { id: user._id.toString(), role: effectiveRole };
        next();
    }
    catch (error) {
        console.error("Authentication error:", error.message);
        next(new AppError_1.AppError(error.message, error.status || 500));
    }
});
exports.protect = protect;
const adminOnly = (req, _res, next) => {
    if (!req.user || req.user.role !== "Admin") {
        return next(new AppError_1.UnauthorizedError("Admins only."));
    }
    next();
};
exports.adminOnly = adminOnly;
