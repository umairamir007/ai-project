// backend/src/middlewares/requireFirebaseAuth.ts
import { adminAuth } from "../lib/firebaseAdmin";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  uid?: string;
}

export async function requireFirebaseAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    console.log("🚀 ~ requireFirebaseAuth ~ authHeader:", authHeader)
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const idToken = authHeader.split(" ")[1];
    const decoded = await adminAuth.verifyIdToken(idToken);

    req.uid = decoded.uid; // attach UID for controllers
    return next();
  } catch (err: any) {
    console.error("Auth failed:", err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
}
