import {Router} from "express";
import {securityController} from "../controller/security-controller";
import {verifyRefreshToken} from "../middlewares/auth-mw";


export const securityRouter = Router({})

securityRouter.get('/',
    verifyRefreshToken,
    securityController.findAllSessions.bind(securityController)
)

securityRouter.delete('/',
    verifyRefreshToken,
    securityController.terminateAllSessions.bind(securityController)
)

securityRouter.delete('/:deviceId',
    verifyRefreshToken,
    securityController.terminateDeviceSessions.bind(securityController)
)