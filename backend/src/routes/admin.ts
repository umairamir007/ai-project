// backend/src/routes/Admin/importUsers.ts
import { Router } from "express";
import { adminDb } from "../lib/firebaseAdmin";

const r = Router();

r.post("/import-users", async (req, res) => {
    const { users } = req.body as { users: any[] };
    if (!Array.isArray(users)) return res.status(400).json({ error: "users array required" });

    const batch = adminDb.batch();
    users.forEach((u) => {
        const ref = adminDb.collection("users").doc(u.id);
        // Keep only the fields you want to store:
        const { id, ...data } = u;
        batch.set(ref, data, { merge: true });
    });
    await batch.commit();
    res.json({ ok: true, count: users.length });
});

export default r;
