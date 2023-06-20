import {Router} from "express";
import {authController} from "../controller/auth-controller";
import {authenticationCheckBearer} from "../middlewares/auth-mw";

export const authRouter = Router({})

authRouter.post('/login', authController.loginUser)

authRouter.post('/registration-confirmation', authController.loginUser)

authRouter.post('/registration', authController.loginUser)

authRouter.post('/registration-email-resending', authController.loginUser)


authRouter.get('/me',
    authenticationCheckBearer,
    authController.getInfoAboutMyself)