import {Request, Response} from "express";
import {UserViewModel} from "../models/Users/UserModel";
import {userService} from "../domain/user-service";
import {jwtService} from "../application/jwt-service";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {authService} from "../domain/auth-service";
import {sessionsService} from "../domain/sessions-service";

export const authController = {
    async loginUser(req: Request, res: Response) {
        const user: UserViewModel | null = await userService
            .checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const accessToken = await jwtService.createJWT(user)
            const deviceId = (+(new Date())).toString()
            const refreshToken = await jwtService.createJWTRefresh(user,deviceId)

            // Подготавливаем данные для записис в таблицу сессий
            const RFTokenInfo = await jwtService.getInfoFromRFToken(refreshToken)
            if (RFTokenInfo === null) {
                res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
                return;
            }
            const loginIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "IP undefined"
            const deviceName: string = req.headers['user-agent'] || "deviceName undefined"

            // Фиксируем сессию
            const sessionRegInfo = await sessionsService.registerSession(loginIp,RFTokenInfo.iat,deviceName,user.id, deviceId)
            if (sessionRegInfo === null) {
                res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
            }

            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
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

        const userId = await userService.createUser(req.body.login, req.body.password, req.body.email, false)
        if (userId) {
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

    async updateTokens(req: Request, res: Response) {


        const accessTokenNew = await jwtService.createJWT(req.user!)

        // Получаем данные о текущем токене
        const CurrentRFTokenInfo = await jwtService.getInfoFromRFToken(req.cookies.refreshToken)
        if (!CurrentRFTokenInfo) {
            res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
            return;
        }

        // Генерируем новый RT
        const refreshTokenNew = await jwtService.createJWTRefresh(req.user!,CurrentRFTokenInfo.deviceId)

        // Подготавливаем данные для записи в таблицу сессий
        const FRTokenInfo = await jwtService.getInfoFromRFToken(refreshTokenNew)
        if (FRTokenInfo === null) {
            res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
            return;
        }
        const loginIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "IP undefined"
        const deviceName = req.headers['User-Agent'] || "deviceName undefined"

        // Обновляем запись в списке сессий
        const sessionRegInfoNew = await sessionsService.updateSession(CurrentRFTokenInfo.iat,CurrentRFTokenInfo.deviceId, loginIp,FRTokenInfo.iat,deviceName,req.user!.id)
        if (!sessionRegInfoNew) {
            res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
            return;
        }

        res.cookie('refreshToken', refreshTokenNew, {httpOnly: true, secure: true,})
        res.status(200).json({"accessToken": accessTokenNew})

    },

    async logoutUser(req: Request, res: Response) {
        const RFTokenInfo = await jwtService.getInfoFromRFToken(req.cookies.refreshToken)
        if (RFTokenInfo === null) {
            res.status(500).json("Не удалось вылогиниться. Попроубуйте позднее")
            return;
        }

        // Удаляем запись с текущей сессией из БД
        const deletionStatus = await sessionsService.deleteSession(RFTokenInfo.iat, req.user!.id)

        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
}