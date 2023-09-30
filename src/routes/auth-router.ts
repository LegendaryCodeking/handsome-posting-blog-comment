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
    authController.loginUser.bind(authController))

authRouter.post('/logout',
    verifyRefreshToken,
    authController.logoutUser.bind(authController))

authRouter.post('/refresh-token',
    verifyRefreshToken,
    inputValidationMw,
    authController.updateTokens.bind(authController))

authRouter.post('/registration-confirmation',
    IpRateLimitMW,
    isCodeCorrect,
    isAlreadyConfirmedCode,
    inputValidationMw,
    authController.registrationConfirmation.bind(authController))

authRouter.post('/registration',
    IpRateLimitMW,
    loginValidation,
    passwordValidation,
    emailValidation,
    doesLoginEmailAlreadyExist,
    inputValidationMw,
    authController.registration.bind(authController))

authRouter.post('/registration-email-resending',
    IpRateLimitMW,
    doesEmailExist,
    isAlreadyConfirmedEmail,
    inputValidationMw,
    authController.registrationEmailResending.bind(authController))


authRouter.get('/me',
    authenticationCheckBearer,
    inputValidationMw,
    authController.getInfoAboutMyself.bind(authController))

authRouter.post('/password-recovery',
    IpRateLimitMW,
    emailValidation,
    inputValidationMw,
    authController.passwordRecovery.bind(authController))

authRouter.post('/new-password',
    IpRateLimitMW,
    passwordUpdateValidation,
    isCodeCorrectForPassRecovery,
    inputValidationMw,
    authController.newPassword.bind(authController))