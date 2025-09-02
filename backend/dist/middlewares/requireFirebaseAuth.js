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
exports.requireFirebaseAuth = requireFirebaseAuth;
// backend/src/middlewares/requireFirebaseAuth.ts
const firebaseAdmin_1 = require("../lib/firebaseAdmin");
function requireFirebaseAuth(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers.authorization;
            console.log("🚀 ~ requireFirebaseAuth ~ authHeader:", authHeader);
            if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer "))) {
                return res.status(401).json({ error: "Missing or invalid Authorization header" });
            }
            const idToken = authHeader.split(" ")[1];
            const decoded = yield firebaseAdmin_1.adminAuth.verifyIdToken(idToken);
            req.uid = decoded.uid; // attach UID for controllers
            return next();
        }
        catch (err) {
            console.error("Auth failed:", err.message);
            return res.status(401).json({ error: "Unauthorized" });
        }
    });
}
