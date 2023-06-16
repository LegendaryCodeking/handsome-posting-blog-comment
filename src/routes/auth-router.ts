import {Router} from "express";
import {authController} from "../controller/auth-controller";

export const authRouter = Router({})

authRouter.post('/login', authController.loginUser)

