import {Router} from "express";
import {authMW} from "../middlewares/auth-mw";
import {container} from "../composition-root";
import {SecurityController} from "../controller/security-controller";

const securityController = container.resolve(SecurityController)

export const securityRouter = Router({})

securityRouter.get('/',
    authMW.verifyRefreshToken.bind(authMW),
    securityController.findAllSessions.bind(securityController)
)

securityRouter.delete('/',
    authMW.verifyRefreshToken.bind(authMW),
    securityController.terminateAllSessions.bind(securityController)
)

securityRouter.delete('/:deviceId',
    authMW.verifyRefreshToken.bind(authMW),
    securityController.terminateDeviceSessions.bind(securityController)
)