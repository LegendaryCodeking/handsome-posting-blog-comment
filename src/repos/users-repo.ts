import {BlogPostFilterModel} from "../models/FilterModel";
import {UserType} from "../models/UserModel";
import {UserViewModel} from "../models/UserViewModel";
import {Filter, Sort} from "mongodb";
import {usersCollection} from "../db/db";
import {UsersWithPaginationModel} from "../models/UsersWithPaginationModel";


const getUserViewModel = (user: UserType): UserViewModel => {
    return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}


export const usersRepo = {
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
    async createUser(createdUser: UserType): Promise<UserViewModel> {
        await usersCollection.insertOne(createdUser)

        return getUserViewModel(createdUser)
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({"id": id});
        return result.deletedCount === 1
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