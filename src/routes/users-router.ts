import {Request, Router} from "express";
import {queryPagination} from "../models/FilterModel";
import {STATUSES_HTTP} from "./http-statuses-const";
import {userService} from "../domain/user-service";

export const usersRouter = Router({})

usersRouter.get('/', async (req, res) => {
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