import {Router} from "express";
import {AuthMW} from "../middlewares/auth-mw";
import {container} from "../composition-root";
import {SecurityController} from "../controller/security-controller";

const securityController = container.resolve(SecurityController)
const authMW = container.resolve(AuthMW)

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