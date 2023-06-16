import {Request, Response} from "express";
import {UserViewModel} from "../models/Users/UserViewModel";
import {userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {STATUSES_HTTP} from "../enum/http-statuses";

export const authController = {
    async loginUser(req: Request, res: Response) {
    const user: UserViewModel | null = await userService
        .checkCredentials(req.body.loginOrEmail, req.body.password)
    if (user) {
        const token = await jwtService.createJWT(user)
        res.status(200).json({"accessToken": token})
        return;
    }
    res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
}

}