"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminBucket = exports.adminAuth = exports.adminDb = void 0;
// backend/src/lib/firebaseAdmin.ts
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const credential = process.env.FIREBASE_SERVICE_ACCOUNT
    ? firebase_admin_1.default.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT))
    : firebase_admin_1.default.credential.applicationDefault();
const app = (_a = firebase_admin_1.default.apps[0]) !== null && _a !== void 0 ? _a : firebase_admin_1.default.initializeApp({
    credential,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});
exports.adminDb = firebase_admin_1.default.firestore(app);
exports.adminAuth = firebase_admin_1.default.auth(app);
exports.adminBucket = firebase_admin_1.default.storage(app).bucket();
