import {BlogPostFilterModel} from "../../models/FilterModel";
import {Filter, Sort} from "mongodb";
import {UserDBModel, UsersWithPaginationModel} from "../../models/Users/UserModel";
import {refreshTokenCollection, usersCollection} from "../../db/db";
import {getUserViewModel} from "../../helpers/map-UserViewModel";
import {RefreshTokenViewModel} from "../../models/Tokens/refreshToken-model";
import {getRefreshTokenViewModel} from "../../helpers/map-RefreshToken";

export const usersQueryRepo = {
    async findUsers(queryFilter: BlogPostFilterModel): Promise<UsersWithPaginationModel> {
        const findFilter: Filter<UserDBModel> = {
            $or: [{"accountData.login": {$regex: queryFilter.searchLoginTerm ?? '', $options: 'i'}},
                {"accountData.email": {$regex: queryFilter.searchEmailTerm ?? '', $options: 'i'}}]
        }
        const sortFilter: Sort = {[queryFilter.sortBy]: queryFilter.sortDirection}

        let foundUsers = await usersCollection
            .find(findFilter)
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)
            .map(user => getUserViewModel(user)).toArray();

        let totalCount = await usersCollection.countDocuments(findFilter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundUsers
        }
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        const user = await usersCollection.findOne({$or: [{"accountData.email": loginOrEmail},{ "accountData.login":loginOrEmail }]})
        if (user) {
            return user
        }
        return null
    },

    async findUserById(id: string) {
        let user = await usersCollection.findOne({id: id})
        if (user) {
            return getUserViewModel(user)
        } else {
            return null
        }
    },
    async findUserByConfirmationCode(code: string) {
        return await usersCollection.findOne({"emailConfirmation.confirmationCode": code})
    },

    async findRefreshToken(token: string): Promise<RefreshTokenViewModel | null>  {
        const RFtoken = await refreshTokenCollection.findOne({refreshToken:token})
        if (RFtoken) {
            return getRefreshTokenViewModel(RFtoken)
        }
        return null

    }
}