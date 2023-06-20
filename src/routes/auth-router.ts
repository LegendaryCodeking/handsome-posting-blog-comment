import {Router} from "express";
import {authController} from "../controller/auth-controller";
import {authenticationCheckBearer} from "../middlewares/auth-mw";

export const authRouter = Router({})

authRouter.post('/login', authController.loginUser)

authRouter.post('/registration-confirmation', authController.registrationConfirmation)

authRouter.post('/registration', authController.registration)

authRouter.post('/registration-email-resending', authController.registrationEmailResending)


authRouter.get('/me',
    authenticationCheckBearer,
    authController.getInfoAboutMyself)