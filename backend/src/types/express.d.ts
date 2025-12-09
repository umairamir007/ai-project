// backend/src/types/http.ts (or wherever your existing interface lives)
import { Request } from "express";

declare global {
  namespace Express {
    interface AuthUser {
      id: string;
      role: "User" | "Admin";
    }

    interface Request {
      user?: AuthUser; // set by protect middleware
      uid?: string; // set by requireFirebaseAuth middleware
      file?: Express.Multer.File;
      files?:
        | Express.Multer.File[]
        | { [fieldname: string]: Express.Multer.File[] };
    }
  }
}

// Explicit request type for handlers that require authentication.
export interface AuthenticatedRequest extends Request {
  user: Express.AuthUser;
}

export {};
