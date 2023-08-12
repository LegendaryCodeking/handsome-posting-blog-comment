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
            const RefreshTokenIssuedAt = await jwtService.getIAT(refreshToken!.refreshToken)
            if (RefreshTokenIssuedAt === null) {
                res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
                return;
            }
            const loginIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "IP undefined"
            const deviceName = req.headers['user-agent'] || "deviceName undefined"

            // Фиксируем сессию
            const sessionRegInfo = await sessionsService.registerSession(loginIp,RefreshTokenIssuedAt,deviceName,user.id, deviceId)
            if (sessionRegInfo === null) {
                res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
            }

            res.cookie('refreshToken', refreshToken!.refreshToken, {httpOnly: true, secure: true,})
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

    async updateTokens(req: Request, res: Response) {

        const accessTokenNew = await jwtService.createJWT(req.user!)
        const deviceId: string = await jwtService.getDeviceId(req.cookies.refreshToken)
        const currentRFTokenIAT = await  jwtService.getIAT(req.cookies.refreshToken)
        if (deviceId === null || currentRFTokenIAT === null) {
            res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
            return;
        }
        const refreshTokenNew = await jwtService.createJWTRefresh(req.user!,deviceId)

        // Подготавливаем данные для записи в таблицу сессий
        const RefreshTokenIssuedAt = await jwtService.getIAT(refreshTokenNew!.refreshToken)
        if (RefreshTokenIssuedAt === null) {
            res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
            return;
        }
        const loginIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "IP undefined"
        const deviceName = req.headers['User-Agent'] || "deviceName undefined"

        // Обновляем запись в списке сессий
        const sessionRegInfoNew = await sessionsService.updateSession(currentRFTokenIAT,deviceId, loginIp,RefreshTokenIssuedAt,deviceName,req.user!.id)
        if (sessionRegInfoNew === null) {
            res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
            return;
        }

        res.cookie('refreshToken', refreshTokenNew.refreshToken, {httpOnly: true, secure: true,})
        res.status(200).json({"accessToken": accessTokenNew})

    },

    async logoutUser(req: Request, res: Response) {
        const currentRFTokenIAT = await  jwtService.getIAT(req.cookies.refreshToken)
        if (currentRFTokenIAT === null) {
            res.status(500).json("Не удалось вылогиниться. Попроубуйте позднее")
            return;
        }

        // Удаляем запись с текущей сессией из БД
        const deletionStatus = await sessionsService.deleteSession(currentRFTokenIAT, req.user!.id)

        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
}