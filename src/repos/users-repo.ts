import {FilterModel} from "../models/FilterModel";
import {UserType} from "../models/UserModel";
import {UserViewModel} from "../models/UserViewModel";
import {Filter, Sort} from "mongodb";
import {usersCollection} from "./db";
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
    async findUsers(queryFilter: FilterModel): Promise<UsersWithPaginationModel> {
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


    }


}