import jwt from "jsonwebtoken";
import User from "../models/userModel";
import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/express";
import { ACCESS_TOKEN_SECRET, ADMIN_EMAIL } from "../constants";
import { AppError, NotFoundError, UnauthorizedError } from "../utils/AppError";

export const protect = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies?.accessToken || req.cookies?.token || req.cookies?.authToken;
    
    // If no token in cookies, check Authorization header
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      throw new UnauthorizedError("Authorization token missing or invalid.");
    }

    let decoded: any;
    try {
      if (!ACCESS_TOKEN_SECRET) {
        throw new AppError("Server configuration error: ACCESS_TOKEN_SECRET not set", 500);
      }
      decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    } catch (err: any) {
      if (err.name === 'JsonWebTokenError') {
        throw new UnauthorizedError("Invalid token. Please login again.");
      }
      if (err.name === 'TokenExpiredError') {
        throw new UnauthorizedError("Token expired. Please login again.");
      }
      throw new UnauthorizedError("Invalid or expired token.");
    }

    const userId = decoded.id;
    // const userId = "" //TODO: TEST OTHER USRES (remove for prod)

    if (!userId) {
      throw new UnauthorizedError("Invalid token payload.");
    }

    const user = await User.findById(userId).select("_id email");
    if (!user) {
      throw new NotFoundError("User not found.");
    }

    const effectiveRole = user.email === ADMIN_EMAIL ? "Admin" : (user.role ?? "User");

    req.user = { id: user._id.toString(), role: effectiveRole };
    next();
  } catch (error: any) {
    console.error("Authentication error:", error.message);
    next(new AppError(error.message, error.status || 500));
  }
};

export const adminOnly = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  if (!req.user || req.user.role !== "Admin") {
    return next(new UnauthorizedError("Admins only."));
  }
  next();
};
