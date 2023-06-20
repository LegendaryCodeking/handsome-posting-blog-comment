import {Request, Response} from "express";
import {UserViewModel} from "../models/Users/UserModel";
import {userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {authService} from "../domain/auth-service";

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
    },

    async getInfoAboutMyself(req: Request, res: Response) {
        const myInfo = {
            "email": req.user!.email,
            "login": req.user!.login,
            "userId": req.user!.id
        }

        res.status(200).json(myInfo)
    },
    async registration(req: Request, res: Response) {
        const user = await userService.createUser(req.body.login,req.body.password, req.body.email, false)
        if (user) {
            res.status(201).send()
        } else {
            res.status(400).send()
        }
    },
    async registrationConfirmation(req: Request, res: Response) {

        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.status(201).send()
        } else {
            res.status(400).send()
        }

    },
    async registrationEmailResending(req: Request, res: Response) {
        const result = await authService.resendEmail(req.body.email)
        if (result) {
            res.status(201).send()
        } else {
            res.status(400).send()
        }
    }
}