import {queryBlogPostPagination} from "../models/FilterModel";
import {UsersWithPaginationModel} from "../models/UsersWithPaginationModel";
import {Request, Response} from "express";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {userService} from "../domain/user-service";

export const usersController = {
    async findAllUsers(req: Request, res: Response<UsersWithPaginationModel>) {
        let queryFilter = queryBlogPostPagination(req)
        let foundUsers = await userService.findUsers(queryFilter)

        res.status(STATUSES_HTTP.OK_200)
            .json(foundUsers)

    },

    async createUser(req: Request, res: Response) {
        let createdUser = await userService.createUser(req.body.login, req.body.password, req.body.email)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdUser)
    },

    async deleteUser(req: Request, res: Response) {
        let deletionStatus: boolean = await userService.deleteUser(req.params.id)
        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }

    }
}