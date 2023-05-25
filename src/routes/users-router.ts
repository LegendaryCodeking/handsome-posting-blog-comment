import {Request, Response, Router} from "express";
import {queryPagination} from "../models/FilterModel";
import {STATUSES_HTTP} from "./http-statuses-const";
import {userService} from "../domain/user-service";
import {UsersWithPaginationModel} from "../models/UsersWithPaginationModel";
import {superAuthorizationCheck} from "../middlewares/authorization-mw";
import {emailValidation, loginValidation, passwordValidation} from "../middlewares/uservalidation-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";

export const usersRouter = Router({})

usersRouter.get('/',
    // superAuthorizationCheck,
    async (req: Request, res: Response<UsersWithPaginationModel>) => {
    let queryFilter = queryPagination(req)
    let foundUsers = await userService.findUsers(queryFilter)

    if (!foundUsers.items.length) {
        res.status(STATUSES_HTTP.NOT_FOUND_404)
            .json(foundUsers)
        return;
    }
    res.status(STATUSES_HTTP.OK_200)
        .json(foundUsers)

})

usersRouter.post('/',
    // superAuthorizationCheck,
    loginValidation,
    passwordValidation,
    emailValidation,
    inputValidationMw,
    async (req, res) => {
        let createdUser = await userService.createUser(req.body.login, req.body.password, req.body.email)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdUser)
    })

usersRouter.delete('/:id',
    // superAuthorizationCheck,
    async (req, res) => {
    let deletionStatus: boolean = await userService.deleteUser(req.params.id)
        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }

    })