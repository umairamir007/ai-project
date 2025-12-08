

import jwt from "jsonwebtoken";

import { NotFoundError, UnauthorizedError, ValidationError } from "../../../utils/AppError";
import { generateAccessToken, generateRefreshToken } from "../../../utils/JWTTokenHelper";
import User from "../../../models/user.model";
import { ACCESS_TOKEN_DURATION, FRONTEND_URL, REFRESH_TOKEN_DURATION, REFRESH_TOKEN_SECRET, RESET_PASSWORD_SECRET } from "../../../constants";
import { sendMail } from "../../../utils/mailer";

export const registerUserService = async (payload: any) => {
    const { firstName, lastName, email, password, confirmPassword } = payload;

    // Check confirm password
    // if (password !== confirmPassword) {
    //     throw new ValidationError("Passwords do not match.");
    // }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ValidationError("User already exists. Please login.");
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        // confirmPassword,
    });

    return {
        message: "User registered successfully.",
        email: user.email,
    };
};

// LOGIN SERVICE
export const loginUserService = async (payload: any) => {
    const { email, password } = payload;

    const user = await User.findOne({ email });

    if (!user) {
        throw new NotFoundError("User not found. Please register first.");
    }

    // Compare password
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) {
        throw new UnauthorizedError("Invalid email or password.");
    }

    const now = Math.floor(Date.now() / 1000);

    // Generate tokens
    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    return {
        message: "Logged in successfully.",
        email: user.email,
        accessToken: {
            token: accessToken,
            expiry: now + ACCESS_TOKEN_DURATION,
        },
        refreshToken: {
            token: refreshToken,
            expiry: now + REFRESH_TOKEN_DURATION,
        },
    };
};

// REFRESH TOKEN SERVICE
export const refreshAccessTokenService = async (refreshToken: string) => {
    const decoded: any = jwt.verify(
        refreshToken,
        REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err) throw new UnauthorizedError("Invalid or expired refresh token.");
            return decoded;
        }
    );

    const user = await User.findById(decoded.id);
    if (!user) throw new NotFoundError("User not found.");

    const now = Math.floor(Date.now() / 1000);

    const newAccessToken = generateAccessToken(user._id.toString());

    return {
        message: "Access token refreshed successfully.",
        accessToken: {
            token: newAccessToken,
            expiry: now + ACCESS_TOKEN_DURATION,
        },
    };
};

// FORGOT PASSWORD SERVICE
export const forgotPasswordService = async (email: string) => {
    const user = await User.findOne({ email });

    if (user) {
        const resetToken = jwt.sign(
            { id: user._id, email: user.email },
            RESET_PASSWORD_SECRET,
            { expiresIn: "1h" }
        );

        const resetLink = `${FRONTEND_URL}/reset-password?token=${resetToken}`;

        await sendMail({
            to: email,
            subject: "Reset your Isai password",
            html: `<p>We received a request to reset your password.</p>
                   <p><a href="${resetLink}">Click here to reset it</a>. This link is valid for 1 hour.</p>
                   <p>If you did not request this, you can safely ignore this email.</p>`,
        });
    }

    return {
        message: "Reset link sent to your email if it exists.",
    };
};

// RESET PASSWORD SERVICE
export const resetPasswordService = async (resetToken: string, newPassword: string) => {
    let decoded: any;
    try {
        decoded = jwt.verify(resetToken, RESET_PASSWORD_SECRET);
    } catch (err) {
        throw new UnauthorizedError("Invalid or expired reset token.");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        throw new NotFoundError("User not found.");
    }

    user.password = newPassword;
    await user.save();

    return {
        message: "Password updated successfully. You can now sign in with your new password.",
    };
};
