import {Request,Response, Router} from "express";
import {userService} from "../domain/user-service";
import {STATUSES_HTTP} from "./http-statuses-const";
import {jwtService} from "../application/jwt-service";
import {UserViewModel} from "../models/UserViewModel";

export const authRouter = Router({})

authRouter.post('/login', async (req: Request,  res: Response) => {
    const user: UserViewModel | null = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (user) {
        const token = await jwtService.createJWT(user)
        res.status(201).send(token)
        return;
    }
    res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
})