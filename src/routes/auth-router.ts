import {Router} from "express";
import {authController} from "../controller/auth-controller";
import {
    authenticationCheckBearer, doesEmailExist,
    doesLoginEmailAlreadyExist,
    isAlreadyConfirmedCode, isAlreadyConfirmedEmail, isCodeCorrect, isCodeCorrectForPassRecovery, verifyRefreshToken
} from "../middlewares/auth-mw";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/uservalidation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {IpRateLimitMW} from "../middlewares/security-mw";

export const authRouter = Router({})

authRouter.post('/login',
    IpRateLimitMW,
    authController.loginUser)

authRouter.post('/logout',
    verifyRefreshToken,
    authController.logoutUser)

authRouter.post('/refresh-token',
    verifyRefreshToken,
    authController.updateTokens)

authRouter.post('/registration-confirmation',
    IpRateLimitMW,
    isCodeCorrect,
    isAlreadyConfirmedCode,
    authController.registrationConfirmation)

authRouter.post('/registration',
    IpRateLimitMW,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMw,
    doesLoginEmailAlreadyExist,
    authController.registration)

authRouter.post('/registration-email-resending',
    IpRateLimitMW,
    doesEmailExist,
    isAlreadyConfirmedEmail,
    authController.registrationEmailResending)


authRouter.get('/me',
    authenticationCheckBearer,
    authController.getInfoAboutMyself)

authRouter.post('/password-recovery',
    IpRateLimitMW,
    emailValidation,
    authController.passwordRecovery)

authRouter.post('/new-password',
    IpRateLimitMW,
    isCodeCorrectForPassRecovery,
    passwordValidation,
    authController.newPassword)