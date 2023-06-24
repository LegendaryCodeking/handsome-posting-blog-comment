import {Router} from "express";
import {authController} from "../controller/auth-controller";
import {
    authenticationCheckBearer, doesEmailExist,
    doesLoginEmailAlreadyExist,
    isAlreadyConfirmedCode, isAlreadyConfirmedEmail, isCodeCorrect, verifyRefreshToken
} from "../middlewares/auth-mw";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/uservalidation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";

export const authRouter = Router({})

authRouter.post('/login', authController.loginUser)

authRouter.post('/logout',
    verifyRefreshToken,
    authController.logoutUser)

authRouter.post('/refresh-token',
    verifyRefreshToken,
    authController.refreshToken)

authRouter.post('/registration-confirmation',
    isCodeCorrect,
    isAlreadyConfirmedCode,
    authController.registrationConfirmation)

authRouter.post('/registration',
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMw,
    doesLoginEmailAlreadyExist,
    authController.registration)

authRouter.post('/registration-email-resending',
    doesEmailExist,
    isAlreadyConfirmedEmail,
    authController.registrationEmailResending)


authRouter.get('/me',
    authenticationCheckBearer,
    authController.getInfoAboutMyself)