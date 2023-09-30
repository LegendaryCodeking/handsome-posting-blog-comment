import {Request, Response} from "express";
import {UserViewModel} from "../models/Users/UserModel";
import {UserService} from "../domain/user-service";
import {JwtService} from "../application/jwt-service";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {AuthService} from "../domain/auth-service";
import {SessionsService} from "../domain/sessions-service";

export class AuthController {

    constructor(
        protected userService: UserService,
        protected jwtService: JwtService,
        protected authService: AuthService,
        protected sessionsService: SessionsService
    ) {

    }

    async loginUser(req: Request, res: Response) {
        const user: UserViewModel | null = await this.userService
            .checkCredentials(req.body.loginOrEmail, req.body.password)
        if (user) {
            const accessToken = await this.jwtService.createJWT(user)
            const deviceId = (+(new Date())).toString()
            const refreshToken = await this.jwtService.createJWTRefresh(user, deviceId)

            // Подготавливаем данные для записи в таблицу сессий
            const RFTokenInfo = await this.jwtService.getInfoFromRFToken(refreshToken)
            if (RFTokenInfo === null) {
                res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
                return;
            }
            const loginIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "IP undefined"
            const deviceName: string = req.headers['user-agent'] || "deviceName undefined"

            // Фиксируем сессию
            const sessionRegInfo = await this.sessionsService.registerSession(loginIp, RFTokenInfo.iat, deviceName, user.id, deviceId)
            if (sessionRegInfo === null) {
                res.status(500).json("Не удалось залогиниться. Попроубуйте позднее")
            }

            res.cookie('refreshToken', refreshToken, {httpOnly: true, secure: true,})
            res.status(200).json({"accessToken": accessToken})
            return;
        }
        res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401);
    }

    async getInfoAboutMyself(req: Request, res: Response) {
        const myInfo = {
            "email": req.user!.email,
            "login": req.user!.login,
            "userId": req.user!.id
        }

        res.status(STATUSES_HTTP.OK_200).json(myInfo)
    }

    async registration(req: Request, res: Response) {

        const user = await this.userService.createUser(req.body.login, req.body.password, req.body.email, false)
        if (user) {
            res.status(STATUSES_HTTP.NO_CONTENT_204).send()
        } else {
            res.status(STATUSES_HTTP.BAD_REQUEST_400).send()
        }
    }

    async registrationConfirmation(req: Request, res: Response) {

        const result = await this.authService.confirmEmail(req.body.code)
        if (result) {
            res.status(STATUSES_HTTP.NO_CONTENT_204).send()
        } else {
            res.status(STATUSES_HTTP.BAD_REQUEST_400).send()
        }

    }

    async registrationEmailResending(req: Request, res: Response) {
        const result = await this.authService.resendEmail(req.body.email)
        if (result) {
            res.status(STATUSES_HTTP.NO_CONTENT_204).send()
        } else {
            res.status(STATUSES_HTTP.BAD_REQUEST_400).send()
        }
    }

    async updateTokens(req: Request, res: Response) {

        const accessTokenNew = await this.jwtService.createJWT(req.user!)

        // Получаем данные о текущем токене
        const CurrentRFTokenInfo = await this.jwtService.getInfoFromRFToken(req.cookies.refreshToken)
        if (!CurrentRFTokenInfo) {
            res.status(STATUSES_HTTP.SERVER_ERROR_500).json("Не удалось залогиниться. Попроубуйте позднее")
            return;
        }

        // Генерируем новый RT
        const refreshTokenNew = await this.jwtService.createJWTRefresh(req.user!, CurrentRFTokenInfo.deviceId)

        // Подготавливаем данные для записи в таблицу сессий
        const FRTokenInfo = await this.jwtService.getInfoFromRFToken(refreshTokenNew)
        if (FRTokenInfo === null) {
            res.status(STATUSES_HTTP.SERVER_ERROR_500).json("Не удалось залогиниться. Попроубуйте позднее")
            return;
        }
        const loginIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || "IP undefined"
        const deviceName = req.headers['User-Agent'] || "deviceName undefined"

        // Обновляем запись в списке сессий
        const sessionRegInfoNew = await this.sessionsService.updateSession(
            CurrentRFTokenInfo.iat,
            CurrentRFTokenInfo.deviceId,
            loginIp,
            FRTokenInfo.iat,
            deviceName,
            req.user!.id)
        if (!sessionRegInfoNew) {
            res.status(STATUSES_HTTP.SERVER_ERROR_500).json("Не удалось залогиниться. Попроубуйте позднее")
            return;
        }

        res.cookie('refreshToken', refreshTokenNew, {httpOnly: true, secure: true,})
        res.status(STATUSES_HTTP.OK_200).json({"accessToken": accessTokenNew})

    }

    async logoutUser(req: Request, res: Response) {
        const RFTokenInfo = await this.jwtService.getInfoFromRFToken(req.cookies.refreshToken)
        if (RFTokenInfo === null) {
            res.status(STATUSES_HTTP.SERVER_ERROR_500).json("Не удалось вылогиниться. Попроубуйте позднее")
            return;
        }

        // Удаляем запись с текущей сессией из БД
        const deletionStatus = await this.sessionsService.deleteSession(RFTokenInfo.iat, req.user!.id)

        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }

    async passwordRecovery(req: Request, res: Response) {
        const user = await this.userService.recoveryPassword(req.body.email)
        if (user) {
            res.status(STATUSES_HTTP.NO_CONTENT_204).send()
        } else {
            res.status(STATUSES_HTTP.SERVER_ERROR_500).send()
        }
    }

    async newPassword(req: Request, res: Response) {
        const result = await this.userService.updatePassword(req.body.newPassword, req.user!.id)
        if (result) {
            res.status(STATUSES_HTTP.NO_CONTENT_204).send()
        } else {
            res.status(STATUSES_HTTP.SERVER_ERROR_500).send()
        }
    }
}

