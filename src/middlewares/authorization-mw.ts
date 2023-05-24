import {NextFunction, Request, Response} from "express";

export const authorizationCheck = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401)
    } else {
        next();
    }
}

export const superAuthorizationCheck = (req: Request, res: Response, next: NextFunction) => {
    // login:"Super Admin";
    // pass: "qwerty12345"
    if (req.headers["authorization"] !== "Basic U3VwZXIgQWRtaW46cXdlcnR5MTIzNDU=") {
        res.sendStatus(401)
    } else {
        next();
    }
}