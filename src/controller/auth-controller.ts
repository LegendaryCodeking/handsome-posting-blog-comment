import {Request, Response} from "express";
import {UserViewModel} from "../models/Users/UserModel";
import {userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {authService} from "../domain/auth-service";
import {usersQueryRepo} from "../repos/query-repos/users-query-repo";
import {usersRepo} from "../repos/users-repo";

export const authController = {
    async loginUser(req: Request, res: Response) {
        const user: UserViewModel | null = await userService
            .checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const accessToken = await jwtService.createJWT(user)
            const refreshToken = await jwtService.createJWTRefresh(user)
            // Проверяем что рефреш токен успешно записался в базу
            if (!refreshToken) {
                res.status(STATUSES_HTTP.SERVER_ERROR_500).json({"Error": "Произошла ошибка при записи рефреш токена в базу данных"})
                return
            }
            res.cookie('refreshToken', refreshToken.refreshToken, {httpOnly: true, secure: true,})
            res.status(200).json({"accessToken": accessToken})
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

        const user = await userService.createUser(req.body.login, req.body.password, req.body.email, false)
        if (user) {
            res.status(204).send()
        } else {
            res.status(400).send()
        }
    },

    async registrationConfirmation(req: Request, res: Response) {

        const result = await authService.confirmEmail(req.body.code)
        if (result) {
            res.status(204).send()
        } else {
            res.status(400).send()
        }

    },

    async registrationEmailResending(req: Request, res: Response) {
        const result = await authService.resendEmail(req.body.email)
        if (result) {
            res.status(STATUSES_HTTP.NO_CONTENT_204).send()
        } else {
            res.status(STATUSES_HTTP.BAD_REQUEST_400).send()
        }
    },

    async refreshToken(req: Request, res: Response) {
        const refreshToken = await usersQueryRepo.findRefreshToken(req.cookies.refreshToken)
        if (!refreshToken) {
            res.status(STATUSES_HTTP.NOT_FOUND_404).send()
            return
        }
        if (!refreshToken.isAlive) {
            res.status(401).send({message: "Unauthorized! refreshToken was expired!"});
            return
        }

        const deactivateRefreshToken = usersRepo.deactivateRefreshToken(req.cookies.refreshToken)
        if (!deactivateRefreshToken) {
            res.status(500).send({message: "Не удалось деактивировать предудущий RefreshToken"});
            return
        }

        const accessTokenNew = await jwtService.createJWT(req.user!)
        const refreshTokenNew = await jwtService.createJWTRefresh(req.user!)
        // Проверяем что рефреш токен успешно записался в базу
        if (!refreshTokenNew) {
            res.status(500).json({"Error": "Произошла ошибка при записи рефреш токена в базу данных"})
            return
        }
        res.cookie('refreshToken', refreshTokenNew.refreshToken, {httpOnly: true, secure: true,})
        res.status(200).json({"accessToken": accessTokenNew})

    },

    async logoutUser(req: Request, res: Response) {
        const deactivateRefreshToken = usersRepo.deactivateRefreshToken(req.cookies.refreshToken)
        if (!deactivateRefreshToken) {
            res.status(STATUSES_HTTP.SERVER_ERROR_500).send({message: "Не удалось деактивировать предудущий RefreshToken"});
            return
        }
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    }
}