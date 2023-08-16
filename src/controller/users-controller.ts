import {queryBlogPostPagination} from "../models/FilterModel";
import {Request, Response} from "express";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {userService} from "../domain/user-service";
import {usersQueryRepo} from "../repos/query-repos/users-query-repo";
import {UsersWithPaginationModel} from "../models/Users/UserModel";

export const usersController = {
    async findAllUsers(req: Request, res: Response<UsersWithPaginationModel>) {
        let queryFilter = queryBlogPostPagination(req)
        let foundUsers = await usersQueryRepo.findUsers(queryFilter)

        res.status(STATUSES_HTTP.OK_200)
            .json(foundUsers)

    },

    async createUser(req: Request, res: Response) {
        let createdUser = await userService.createUser(req.body.login, req.body.password, req.body.email, true)

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