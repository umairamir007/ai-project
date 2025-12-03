import { Router } from "express";
import { loginUser, refreshAccessToken, registerUser } from "../controllers/user.controller";



const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshAccessToken)

export default router;
