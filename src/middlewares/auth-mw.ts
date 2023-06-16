import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepo} from "../repos/query-repos/users-query-repo";

export const authenticationCheck = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401)
    } else {
        next();
    }
}





export const authenticationCheckBearer = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        res.sendStatus(401)
        return
    }

    const token = req.headers.authorization.split(' ')[1]

    const userID = await jwtService.getUserIdByToken(token)
    if(userID) {
        req.user = await usersQueryRepo.findUserById(userID)
        next()
        return;
    }
    res.sendStatus(401)
}