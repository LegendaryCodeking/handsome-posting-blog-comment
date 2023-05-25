import {Request,Response, Router} from "express";
import {userService} from "../domain/user-service";
import {STATUSES_HTTP} from "./http-statuses-const";

export const authRouter = Router({})

authRouter.post('/login', async (req: Request,  res: Response) => {
    const checkResult = await userService.checkCredentials(req.body.loginOrEmail, req.body.password)
    if (checkResult) {
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204);
        return ;
    }
    res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
})