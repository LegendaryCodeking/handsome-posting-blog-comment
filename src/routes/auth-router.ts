import {Router} from "express";
import {
    authMW
} from "../middlewares/auth-mw";
import {
    emailValidation,
    loginValidation,
    passwordUpdateValidation,
    passwordValidation
} from "../middlewares/uservalidation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";
import {IpRateLimitMW} from "../middlewares/security-mw";
import {authController} from "../composition-root";

export const authRouter = Router({})

authRouter.post('/login',
    IpRateLimitMW,
    inputValidationMw,
    authController.loginUser.bind(authController))

authRouter.post('/logout',
    authMW.verifyRefreshToken.bind(authMW),
    authController.logoutUser.bind(authController))

authRouter.post('/refresh-token',
    authMW.verifyRefreshToken.bind(authMW),
    inputValidationMw,
    authController.updateTokens.bind(authController))

authRouter.post('/registration-confirmation',
    IpRateLimitMW,
    authMW.isCodeCorrect.bind(authMW),
    authMW.isAlreadyConfirmedCode.bind(authMW),
    inputValidationMw,
    authController.registrationConfirmation.bind(authController))

authRouter.post('/registration',
    IpRateLimitMW,
    loginValidation,
    passwordValidation,
    emailValidation,
    authMW.doesLoginEmailAlreadyExist.bind(authMW),
    inputValidationMw,
    authController.registration.bind(authController))

authRouter.post('/registration-email-resending',
    IpRateLimitMW,
    authMW.doesEmailExist.bind(authMW),
    authMW.isAlreadyConfirmedEmail.bind(authMW),
    inputValidationMw,
    authController.registrationEmailResending.bind(authController))


authRouter.get('/me',
    authMW.authenticationCheckBearer.bind(authMW),
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
    authMW.isCodeCorrectForPassRecovery.bind(authMW),
    inputValidationMw,
    authController.newPassword.bind(authController))