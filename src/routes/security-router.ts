import {Router} from "express";
import {securityController} from "../controller/security-controller";
import {verifyRefreshToken} from "../middlewares/auth-mw";


export const securityRouter = Router({})

securityRouter.get('/',
    securityController.findAllSessions
)

securityRouter.delete('/',
    verifyRefreshToken,
    securityController.terminateAllSessions
)

securityRouter.delete('/:deviceId',
    verifyRefreshToken,
    securityController.terminateDeviceSessions
)