import {FilterModel} from "../models/FilterModel";
import {UserType} from "../models/UserModel";
import {UserViewModel} from "../models/UserViewModel";



const getUserViewModel = (user: UserType): UserViewModel => {
    return {
        id: user.id,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt
    }
}


export const usersRepo = {
    async findUsers(queryFilter: FilterModel): Promise<T> {

    }
}