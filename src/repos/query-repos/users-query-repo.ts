import {BlogPostFilterModel} from "../../models/FilterModel";
import {UsersWithPaginationModel} from "../../models/Users/UsersWithPaginationModel";
import {Filter, Sort} from "mongodb";
import {UserType} from "../../models/Users/UserModel";
import {usersCollection} from "../../db/db";
import {getUserViewModel} from "../../helpers/map-UserViewModel";

export const usersQueryRepo = {
    async findUsers(queryFilter: BlogPostFilterModel): Promise<UsersWithPaginationModel> {
        const findFilter: Filter<UserType> = {
            $or: [{login: {$regex: queryFilter.searchLoginTerm ?? '', $options: 'i'}},
                {email: {$regex: queryFilter.searchEmailTerm ?? '', $options: 'i'}}]
        }
        const sortFilter: Sort = {[queryFilter.sortBy]: queryFilter.sortDirection}

        let foundUsers = await usersCollection
            .find(findFilter)
            .sort(sortFilter)
            .skip((queryFilter.pageNumber - 1) * queryFilter.pageSize)
            .limit(queryFilter.pageSize)
            .map(blog => getUserViewModel(blog)).toArray();

        let totalCount = await usersCollection.countDocuments(findFilter)

        return {
            "pagesCount": Math.ceil(totalCount / queryFilter.pageSize),
            "page": queryFilter.pageNumber,
            "pageSize": queryFilter.pageSize,
            "totalCount": totalCount,
            "items": foundUsers
        }
    },

    async findByLoginOrEmail(loginOrEmail: string) {
        const user = await usersCollection.findOne({$or: [{email: loginOrEmail},{ login:loginOrEmail }]})
        return user
    },

    async findUserById(id: string) {
        let user = await usersCollection.findOne({id: id})
        if (user) {
            return user
        } else {
            return null
        }
    }
}