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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/src/routes/Admin/importUsers.ts
const express_1 = require("express");
const firebaseAdmin_1 = require("../lib/firebaseAdmin");
const r = (0, express_1.Router)();
r.post("/import-users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { users } = req.body;
    if (!Array.isArray(users))
        return res.status(400).json({ error: "users array required" });
    const batch = firebaseAdmin_1.adminDb.batch();
    users.forEach((u) => {
        const ref = firebaseAdmin_1.adminDb.collection("users").doc(u.id);
        // Keep only the fields you want to store:
        const { id } = u, data = __rest(u, ["id"]);
        batch.set(ref, data, { merge: true });
    });
    yield batch.commit();
    res.json({ ok: true, count: users.length });
}));
exports.default = r;
