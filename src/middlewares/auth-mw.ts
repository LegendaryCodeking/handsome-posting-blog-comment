import {NextFunction, Request, Response} from "express";
import {jwtService} from "../application/jwt-service";
import {usersQueryRepo} from "../repos/query-repos/users-query-repo";
import {TokenExpiredError} from "jsonwebtoken";
import {STATUSES_HTTP} from "../enum/http-statuses";


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
    if (userID) {
        req.user = await usersQueryRepo.findUserById(userID)
        next()
        return;
    }
    res.sendStatus(401)
}

export const doesLoginEmailAlreadyExist = async (req: Request, res: Response, next: NextFunction) => {
    const loginExists = await usersQueryRepo.findByLoginOrEmail(req.body.login)
    const emailExists = await usersQueryRepo.findByLoginOrEmail(req.body.email)


    if (loginExists) {
        res.status(400)
            .json({errorsMessages: [{message: "Login or email is already used on the website", field: "login"}]}
            )
        return
    }


    if (emailExists) {
        res.status(400)
            .json({errorsMessages: [{message: "Login or email is already used on the website", field: "email"}]}
            )
        return
    }

    next()

}

export const isCodeCorrect = async (req: Request, res: Response, next: NextFunction) => {
    const correct = await usersQueryRepo.findUserByConfirmationCode(req.body.code)


    if (!correct) {
        res.status(400)
            .json({errorsMessages: [{message: "Confirmation code is incorrect", field: "code"}]}
            )
        return
    }

    next()

}

export const isAlreadyConfirmedCode = async (req: Request, res: Response, next: NextFunction) => {
    const confirmed = await usersQueryRepo.findUserByConfirmationCode(req.body.code)


    if (confirmed!.emailConfirmation.isConfirmed) {
        res.status(400)
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
        res.status(400)
            .json({errorsMessages: [{message: "The email is incorrect", field: "email"}]}
            )
        return
    }

    next()

}

const catchTokenError = (err: any, res: Response) => {
    if (err instanceof TokenExpiredError) {
        return res.status(STATUSES_HTTP.UNAUTHORIZED_401).send({message: "Unauthorized! was expired!"});
    }

    return res.sendStatus(STATUSES_HTTP.UNAUTHORIZED_401).send({message: "Unauthorized!"});
}

export const verifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {

    const refreshToken = req.cookies.refreshToken

    if (!refreshToken) {
        res.status(STATUSES_HTTP.UNAUTHORIZED_401)
            .json({errorsMessages: [{message: "No token provided!", field: "refreshToken"}]}
            )
        return
    }

        try {
            const userID = await jwtService.getUserIdByToken(refreshToken)
            req.user = await usersQueryRepo.findUserById(userID)
            next()
        } catch (e) {
            return catchTokenError(e, res)
        }


}