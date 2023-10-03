import {NextFunction, Request, Response} from "express";
import {JwtService} from "../application/jwt-service";
import {UsersQueryRepo} from "../repos/query-repos/users-query-repo";
import jwt, {TokenExpiredError} from "jsonwebtoken";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {SessionsQueryRepo} from "../repos/query-repos/sessions-query-repo";
import {UserDBModel} from "../models/Users/UserModel";
import {getUserViewModel} from "../helpers/map-UserViewModel";
import {UsersRepo} from "../repos/users-repo";
import {inject, injectable} from "inversify";

@injectable()
export class AuthMW {
    @inject(JwtService) private jwtService: JwtService;
    @inject(UsersQueryRepo) private usersQueryRepo: UsersQueryRepo;
    @inject(UsersRepo) private usersRepo: UsersRepo;
    @inject(SessionsQueryRepo) private sessionsQueryRepo: SessionsQueryRepo;

    constructor() {
        this.jwtService = new JwtService()
        this.usersQueryRepo = new UsersQueryRepo()
        this.usersRepo = new UsersRepo()
        this.sessionsQueryRepo = new SessionsQueryRepo()
    }

    async addReqUser(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            next()
            return
        }

        const token = req.headers.authorization.split(' ')[1]

        const RFTokenInfo = await this.jwtService.getInfoFromRFToken(token)
        if (RFTokenInfo) {
            req.user = await this.usersQueryRepo.findUserById(RFTokenInfo.userId)
            next()
            return;
        }
        next()
    }



    authenticationCheck(req: Request, res: Response, next: NextFunction) {
        if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
            res.sendStatus(401)
        } else {
            next();
        }
    }

    async authenticationCheckBearer(req: Request, res: Response, next: NextFunction) {
        if (!req.headers.authorization) {
            res.sendStatus(401)
            return
        }

        const token = req.headers.authorization.split(' ')[1]

        const RFTokenInfo = await this.jwtService.getInfoFromRFToken(token)
        if (RFTokenInfo) {
            req.user = await this.usersQueryRepo.findUserById(RFTokenInfo.userId)
            next()
            return;
        }
        res.sendStatus(401)
    }

    async doesLoginEmailAlreadyExist(req: Request, res: Response, next: NextFunction) {
        const loginExists = await this.usersQueryRepo.findByLoginOrEmail(req.body.login)
        const emailExists = await this.usersQueryRepo.findByLoginOrEmail(req.body.email)


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

    async isCodeCorrect(req: Request, res: Response, next: NextFunction) {
        const correct = await this.usersQueryRepo.findUserByConfirmationCode(req.body.code)

        if (!correct) {
            res.status(STATUSES_HTTP.BAD_REQUEST_400)
                .json({errorsMessages: [{message: "Confirmation code is incorrect", field: "code"}]}
                )
            return
        }

        next()
    }

    async isCodeCorrectForPassRecovery(req: Request, res: Response, next: NextFunction) {
        const user: UserDBModel | null = await this.usersRepo.findUserByPassRecoveryCode(req.body.recoveryCode)

        if ((req.body.recoveryCode === '') || !user) {
            res.status(STATUSES_HTTP.BAD_REQUEST_400)
                .json({errorsMessages: [{message: "Confirmation code is incorrecttttttttttt", field: "recoveryCode"}]}
                )
            return
        }

        if (!user!.passwordRecovery!.active) {
            res.status(STATUSES_HTTP.BAD_REQUEST_400)
                .json({errorsMessages: [{message: "Confirmation code has been already used", field: "recoveryCode"}]}
                )
            return
        }

        // Check that the token is up-to-date
        try {
            jwt.verify(req.body.recoveryCode, process.env.JWT_SECRET!)
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                return res.status(STATUSES_HTTP.BAD_REQUEST_400).send({message: "Code has expired!", field: "newPassword"});
            }

            return res.status(STATUSES_HTTP.BAD_REQUEST_400).send({message: "Code is incorrect! Try repeat a bit later", field: "newPassword"});
        }
        req.user = getUserViewModel(user)
        next()
    }

    async isAlreadyConfirmedCode(req: Request, res: Response, next: NextFunction) {
        const confirmed = await this.usersRepo.findUserByConfirmationCode(req.body.code)


        if (confirmed!.emailConfirmation.isConfirmed) {
            res.status(STATUSES_HTTP.BAD_REQUEST_400)
                .json({errorsMessages: [{message: "The email is already confirmed", field: "code"}]}
                )
            return
        }

        next()

    }

    async isAlreadyConfirmedEmail(req: Request, res: Response, next: NextFunction) {
        const confirmed = await this.usersRepo.findByLoginOrEmail(req.body.email)


        if (confirmed?.emailConfirmation.isConfirmed === true) {
            res.status(400)
                .json({errorsMessages: [{message: "The email is already confirmed", field: "email"}]}
                )
            return
        }

        next()

    }

    async doesEmailExist(req: Request, res: Response, next: NextFunction) {
        const existence = await this.usersQueryRepo.findByLoginOrEmail(req.body.email)


        if (!existence) {
            res.status(STATUSES_HTTP.BAD_REQUEST_400)
                .json({errorsMessages: [{message: "The email is incorrect", field: "email"}]}
                )
            return
        }

        next()
    }

    catchTokenError(err: any, res: Response){
        if (err instanceof TokenExpiredError) {
            return res.status(STATUSES_HTTP.UNAUTHORIZED_401).send({message: "Unauthorized! Token has expired!"});
        }

        return res.status(STATUSES_HTTP.UNAUTHORIZED_401).send({message: "Unauthorized!"});
    }

    async verifyRefreshToken(req: Request, res: Response, next: NextFunction) {

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
            const isActive = await this.sessionsQueryRepo.findSessionWithRFToken(RFTIAT, deviceId)
            if (!isActive) {
                res.status(STATUSES_HTTP.UNAUTHORIZED_401)
                    .json({errorsMessages: [{message: "Unauthorized! В БД с сессиями нет такой записи", field: "refreshToken"}]}
                    )
                return
            }

            req.user = await this.usersQueryRepo.findUserById(result.userId)
            next()
        } catch (e) {
            return this.catchTokenError(e, res)
        }


    }
}

export const authMW = new AuthMW()





