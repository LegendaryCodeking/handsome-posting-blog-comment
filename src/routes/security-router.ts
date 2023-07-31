import {Router} from "express";
import {securityController} from "../controller/security-controller";


export const securityRouter = Router({})

securityRouter.get('/',
    securityController.findAllSessions
)

securityRouter.delete('/',
    securityController.terminateAllSessions
)

securityRouter.delete('/:deviceId',
    securityController.terminateDeviceSessions
)