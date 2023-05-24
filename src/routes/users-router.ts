import {Request, Response, Router} from "express";
import {queryPagination} from "../models/FilterModel";
import {STATUSES_HTTP} from "./http-statuses-const";
import {userService} from "../domain/user-service";
import {UsersWithPaginationModel} from "../models/UsersWithPaginationModel";
import {superAuthorizationCheck} from "../middlewares/authorization-mw";

export const usersRouter = Router({})

usersRouter.get('/', superAuthorizationCheck, async (req: Request, res: Response<UsersWithPaginationModel>) => {
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