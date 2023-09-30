import {queryBlogPostPagination} from "../models/FilterModel";
import {Request, Response} from "express";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {UserService} from "../domain/user-service";
import {UsersQueryRepo} from "../repos/query-repos/users-query-repo";
import {UsersWithPaginationModel} from "../models/Users/UserModel";

export class UsersController {

    constructor(
        protected usersQueryRepo: UsersQueryRepo,
        protected userService: UserService
    ) {
    }

    async findAllUsers(req: Request, res: Response<UsersWithPaginationModel>) {
        let queryFilter = queryBlogPostPagination(req)
        let foundUsers = await this.usersQueryRepo.findUsers(queryFilter)

        res.status(STATUSES_HTTP.OK_200)
            .json(foundUsers)
    }

    async createUser(req: Request, res: Response) {
        const createdUser = await this.userService.createUser(req.body.login, req.body.password, req.body.email, true)
        if (createdUser.data === null) {
            res.status(STATUSES_HTTP.BAD_REQUEST_400)
                .json({"message": createdUser.errorMessage})
        }
        const foundUser = await this.usersQueryRepo.findUserById(createdUser.data!)
        res.status(STATUSES_HTTP.CREATED_201)
            .json(foundUser)
    }

    async deleteUser(req: Request, res: Response) {
        let deletionStatus: boolean = await this.userService.deleteUser(req.params.id)
        if (deletionStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
}