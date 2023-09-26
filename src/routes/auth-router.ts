import {Router} from "express";
import {authController} from "../controller/auth-controller";
import {
    authenticationCheckBearer, doesEmailExist,
    doesLoginEmailAlreadyExist,
    isAlreadyConfirmedCode, isAlreadyConfirmedEmail, isCodeCorrect, isCodeCorrectForPassRecovery, verifyRefreshToken
} from "../middlewares/auth-mw";
import {
    emailValidation,
    loginValidation,
    passwordUpdateValidation,
    passwordValidation
} from "../middlewares/uservalidation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {IpRateLimitMW} from "../middlewares/security-mw";

export const authRouter = Router({})

authRouter.post('/login',
    IpRateLimitMW,
    inputValidationMw,
    authController.loginUser)

authRouter.post('/logout',
    verifyRefreshToken,
    authController.logoutUser)

authRouter.post('/refresh-token',
    verifyRefreshToken,
    inputValidationMw,
    authController.updateTokens)

authRouter.post('/registration-confirmation',
    IpRateLimitMW,
    isCodeCorrect,
    isAlreadyConfirmedCode,
    inputValidationMw,
    authController.registrationConfirmation)

authRouter.post('/registration',
    IpRateLimitMW,
    loginValidation,
    passwordValidation,
    emailValidation,
    doesLoginEmailAlreadyExist,
    inputValidationMw,
    authController.registration)

authRouter.post('/registration-email-resending',
    IpRateLimitMW,
    doesEmailExist,
    isAlreadyConfirmedEmail,
    inputValidationMw,
    authController.registrationEmailResending)


authRouter.get('/me',
    authenticationCheckBearer,
    inputValidationMw,
    authController.getInfoAboutMyself)

authRouter.post('/password-recovery',
    IpRateLimitMW,
    emailValidation,
    inputValidationMw,
    authController.passwordRecovery)

authRouter.post('/new-password',
    IpRateLimitMW,
    passwordUpdateValidation,
    isCodeCorrectForPassRecovery,
    inputValidationMw,
    authController.newPassword)