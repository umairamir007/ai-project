// backend/src/types/http.ts (or wherever your existing interface lives)
import { Request } from "express";

// ✅ Your existing shape + Firebase + Multer
export interface AuthenticatedRequest extends Request {
  user?: { id: string; role: "User" | "Admin" };               // you already had this
  uid?: string;                                                // set by requireFirebaseAuth
  file?: Express.Multer.File;                                  // set by multer.single('file')
  files?:
  | Express.Multer.File[]
  | { [fieldname: string]: Express.Multer.File[] };          // for .array()/ .fields()
}
