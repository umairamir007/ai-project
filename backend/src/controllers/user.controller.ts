import { Request, Response, NextFunction } from "express";
import validatePayload from "../utils/validatePayload";
import { AppError } from "../utils/AppError";
import { forgotPasswordService, loginUserService, refreshAccessTokenService, registerUserService, resetPasswordService } from "../services/ElevenLabs/auth/user.service";
import { forgotPasswordSchema, loginUserSchema, refreshTokenSchema, registerUserSchema, resetPasswordSchema } from "../validations/auth.validation";


// REGISTER CONTROLLER
export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validatePayload(registerUserSchema, req.body);

        const response = await registerUserService(req.body);
        res.status(201).json(response);
    } catch (err: any) {
        next(new AppError(err.message, err.status || 500));
    }
};

// LOGIN CONTROLLER
export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validatePayload(loginUserSchema, req.body);

        const response = await loginUserService(req.body);
        res.status(200).json(response);
    } catch (err: any) {
        next(new AppError(err.message, err.status || 500));
    }
};

// REFRESH TOKEN CONTROLLER
export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validatePayload(refreshTokenSchema, req.body);

        const { refreshToken } = req.body;
        const response = await refreshAccessTokenService(refreshToken);

        res.status(200).json(response);
    } catch (err: any) {
        next(new AppError(err.message, err.status || 500));
    }
};

// FORGOT PASSWORD CONTROLLER
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validatePayload(forgotPasswordSchema, req.body);

        const { email } = req.body;
        const response = await forgotPasswordService(email);

        res.status(200).json(response);
    } catch (err: any) {
        next(new AppError(err.message, err.status || 500));
    }
};

// RESET PASSWORD CONTROLLER
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        validatePayload(resetPasswordSchema, req.body);

        const { resetToken, newPassword } = req.body;
        const response = await resetPasswordService(resetToken, newPassword);

        res.status(200).json(response);
    } catch (err: any) {
        next(new AppError(err.message, err.status || 500));
    }
};
