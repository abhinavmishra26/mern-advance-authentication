import express from "express";
import { forgetPassword, login, Logout, signup, verifyEmail ,resetPassword ,checkAuth}  from "../Controllers/authController.js";
import { verifyToken } from "../middleware/verifyToken.js";

const authRouter=express.Router();

authRouter.get("/check-auth",verifyToken,checkAuth);

authRouter.post("/signup",signup);
authRouter.post("/login",login);
authRouter.post("/logout",Logout);

authRouter.post("/verify-email",verifyEmail);
authRouter.post("/forget-password",forgetPassword)
authRouter.post("/reset-password/:token",resetPassword)

export default authRouter;