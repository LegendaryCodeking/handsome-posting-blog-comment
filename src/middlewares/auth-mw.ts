import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepo} from "../repos/query-repos/users-query-repo";
import jwt, {TokenExpiredError} from "jsonwebtoken";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {sessionsQueryRepo} from "../repos/query-repos/sessions-query-repo";
import {UserDBModel} from "../models/Users/UserModel";


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

    const RFTokenInfo = await jwtService.getInfoFromRFToken(token)
    if (RFTokenInfo) {
        req.user = await usersQueryRepo.findUserById(RFTokenInfo.userId)
        next()
        return;
    }
    res.sendStatus(401)
}

export const doesLoginEmailAlreadyExist = async (req: Request, res: Response, next: NextFunction) => {
    const loginExists = await usersQueryRepo.findByLoginOrEmail(req.body.login)
    const emailExists = await usersQueryRepo.findByLoginOrEmail(req.body.email)


    if (loginExists) {
        res.status(STATUSES_HTTP.BAD_REQUEST_400)
            .json({errorsMessages: [{message: "Login or email is already used on the website", field: "login"}]}
            )
        return
    }


    if (emailExists) {
        res.status(STATUSES_HTTP.BAD_REQUEST_400)
            .json({errorsMessages: [{message: "Login or email is already used on the website", field: "email"}]}
            )
        return
    }
    next()

}

export const isCodeCorrect = async (req: Request, res: Response, next: NextFunction) => {
    const correct = await usersQueryRepo.findUserByConfirmationCode(req.body.code)


    if (!correct) {
        res.status(STATUSES_HTTP.BAD_REQUEST_400)
            .json({errorsMessages: [{message: "Confirmation code is incorrect", field: "code"}]}
            )
        return
    }

    next()

}

export const isCodeCorrectForPassRecovery = async (req: Request, res: Response, next: NextFunction) => {
    const user: UserDBModel | null = await usersQueryRepo.findUserByPassRecoveryCode(req.body.recoveryCode)

    if ((req.body.recoveryCode = '') || user!) {
        res.status(STATUSES_HTTP.BAD_REQUEST_400)
            .json({errorsMessages: [{message: "Confirmation code is incorrect", field: "code"}]}
            )
        return
    }

    if (!user!.passwordRecovery!.active) {
        res.status(STATUSES_HTTP.BAD_REQUEST_400)
            .json({errorsMessages: [{message: "Confirmation code has been activated", field: "code"}]}
            )
        return
    }

    // Check that the token is up to date
    try {
        const result: any = jwt.verify(req.body.code, process.env.JWT_SECRET!)
    } catch (e) {
        return catchTokenError(e, res)
    }

    req.user = user
    next()
}

export const isAlreadyConfirmedCode = async (req: Request, res: Response, next: NextFunction) => {
    const confirmed = await usersQueryRepo.findUserByConfirmationCode(req.body.code)


    if (confirmed!.emailConfirmation.isConfirmed) {
        res.status(STATUSES_HTTP.BAD_REQUEST_400)
            .json({errorsMessages: [{message: "The email is already confirmed", field: "code"}]}
            )
        return
    }

    next()

}

export const isAlreadyConfirmedEmail = async (req: Request, res: Response, next: NextFunction) => {
    const confirmed = await usersQueryRepo.findByLoginOrEmail(req.body.email)


    if (confirmed?.emailConfirmation.isConfirmed === true) {
        res.status(400)
            .json({errorsMessages: [{message: "The email is already confirmed", field: "email"}]}
            )
        return
    }

    next()

}

export const doesEmailExist = async (req: Request, res: Response, next: NextFunction) => {
    const existence = await usersQueryRepo.findByLoginOrEmail(req.body.email)


    if (!existence) {
        res.status(STATUSES_HTTP.BAD_REQUEST_400)
            .json({errorsMessages: [{message: "The email is incorrect", field: "email"}]}
            )
        return
    }

    next()

}

const catchTokenError = (err: any, res: Response) => {
    if (err instanceof TokenExpiredError) {
        return res.status(STATUSES_HTTP.UNAUTHORIZED_401).send({message: "Unauthorized! Token has expired!"});
    }

    return res.status(STATUSES_HTTP.UNAUTHORIZED_401).send({message: "Unauthorized!"});
}

export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {

    const refreshTokenCookie = req.cookies.refreshToken

    if (!refreshTokenCookie) {
        res.status(STATUSES_HTTP.UNAUTHORIZED_401)
            .json({errorsMessages: [{message: "No token provided!", field: "refreshToken"}]}
            )
        return
    }
    try {
        const result: any = jwt.verify(refreshTokenCookie, process.env.JWT_SECRET!)

        // Проверяем наличие RFToken в базе активных сессий
        const deviceId: string = result.deviceId
        const RFTIAT = result.iat * 1000
        const isActive = await sessionsQueryRepo.findSessionWithRFToken(RFTIAT, deviceId)
        if (!isActive) {
            res.status(STATUSES_HTTP.UNAUTHORIZED_401)
                .json({errorsMessages: [{message: "Unauthorized! В БД с сессиями нет такой записи", field: "refreshToken"}]}
                )
            return
        }

        req.user = await usersQueryRepo.findUserById(result.userId)
        next()
    } catch (e) {
        return catchTokenError(e, res)
    }


}