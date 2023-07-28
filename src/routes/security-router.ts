import {Router} from "express";


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