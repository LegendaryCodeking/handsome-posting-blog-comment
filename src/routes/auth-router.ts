import {Router} from "express";
import {authController} from "../controller/auth-controller";
import {
    authenticationCheckBearer,
    doesLoginEmailAlreadyExist,
    isAlreadyConfirmedCode, isAlreadyConfirmedEmail
} from "../middlewares/auth-mw";

export const authRouter = Router({})

authRouter.post('/login', authController.loginUser)

authRouter.post('/registration-confirmation',
    isAlreadyConfirmedCode,
    authController.registrationConfirmation)

authRouter.post('/registration',
    doesLoginEmailAlreadyExist,
    authController.registration)

authRouter.post('/registration-email-resending',
    isAlreadyConfirmedEmail,
    authController.registrationEmailResending)


authRouter.get('/me',
    authenticationCheckBearer,
    authController.getInfoAboutMyself)