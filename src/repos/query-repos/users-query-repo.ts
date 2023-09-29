import {BlogPostFilterModel} from "../../models/FilterModel";
import {Sort} from "mongodb";
import {UserDBModel, UsersWithPaginationModel, UserViewModel} from "../../models/Users/UserModel";
import {UserModelClass} from "../../db/db";
import {getUserViewModel} from "../../helpers/map-UserViewModel";
import {FilterQuery} from "mongoose";

export const usersQueryRepo = {
    async findUsers(queryFilter: BlogPostFilterModel): Promise<UsersWithPaginationModel> {
        const findFilter: FilterQuery<UserDBModel> = {
            $or: [{"accountData.login": {$regex: queryFilter.searchLoginTerm ?? '', $options: 'i'}},
                {"accountData.email": {$regex: queryFilter.searchEmailTerm ?? '', $options: 'i'}}]
        }
        const sortFilter: Sort = {[queryFilter.sortBy]: queryFilter.sortDirection}

        let foundUsersMongoose = await UserModelClass
            .find(findFilter).lean()
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)


        const foundUsers = foundUsersMongoose.map(user => getUserViewModel(user))

        let totalCount = await UserModelClass.countDocuments(findFilter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundUsers
        }
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserViewModel | null> {
        const user = await UserModelClass.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]})
        if (user) {
            return getUserViewModel(user)
        }
        return null
    },

    async findUserById(id: string) {
        let user = await UserModelClass.findOne({id: id})
        if (user) {
            return getUserViewModel(user)
        } else {
            return null
        }
    },
    async findUserByConfirmationCode(code: string) {
        let user = await UserModelClass.findOne({"emailConfirmation.confirmationCode": code})
        if (user) {
            return getUserViewModel(user)
        } else {
            return null
        }
    }
}