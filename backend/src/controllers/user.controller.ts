import { Request, Response, NextFunction } from "express";
import validatePayload from "../utils/validatePayload";
import { AppError } from "../utils/AppError";
import { loginUserService, refreshAccessTokenService, registerUserService } from "../services/ElevenLabs/auth/user.service";
import { loginUserSchema, refreshTokenSchema, registerUserSchema } from "../validations/auth.validation";


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
