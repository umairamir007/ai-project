import { Router } from "express";
import { forgotPassword, loginUser, refreshAccessToken, registerUser, resetPassword } from "../controllers/user.controller";



const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken)
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
