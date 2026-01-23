import { Request, Response, NextFunction } from "express";
import validatePayload from "../utils/validatePayload";
import { AppError } from "../utils/AppError";
import { ACCESS_TOKEN_DURATION, NODE_ENV, REFRESH_TOKEN_DURATION } from "../constants";
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
        res
            .cookie("accessToken", response.accessToken.token, {
                httpOnly: true,
                sameSite: "lax",
                secure: NODE_ENV === "production",
                maxAge: ACCESS_TOKEN_DURATION * 1000,
            })
            .cookie("refreshToken", response.refreshToken.token, {
                httpOnly: true,
                sameSite: "lax",
                secure: NODE_ENV === "production",
                maxAge: REFRESH_TOKEN_DURATION * 1000,
            })
            .status(200)
            .json(response);
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

        res
            .cookie("accessToken", response.accessToken.token, {
                httpOnly: true,
                sameSite: "lax",
                secure: NODE_ENV === "production",
                maxAge: ACCESS_TOKEN_DURATION * 1000,
            })
            .status(200)
            .json(response);
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

// LOGOUT CONTROLLER
export const logoutUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Clear the cookies by setting them with maxAge: 0
        res
            .cookie("accessToken", "", {
                httpOnly: true,
                sameSite: "lax",
                secure: NODE_ENV === "production",
                maxAge: 0,
            })
            .cookie("refreshToken", "", {
                httpOnly: true,
                sameSite: "lax",
                secure: NODE_ENV === "production",
                maxAge: 0,
            })
            .status(200)
            .json({ message: "Logged out successfully" });
    } catch (err: any) {
        next(new AppError(err.message, err.status || 500));
    }
};
