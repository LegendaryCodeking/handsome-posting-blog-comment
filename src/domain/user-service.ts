import {FilterModel} from "../models/FilterModel";
import {usersRepo} from "../repos/users-repo";
import {UsersWithPaginationModel} from "../models/UsersWithPaginationModel";
import {UserViewModel} from "../models/UserViewModel";
import {UserType} from "../models/UserModel";


export const userService = {
    async findUsers(queryFilter: FilterModel) : Promise<UsersWithPaginationModel>{
        return usersRepo.findUsers(queryFilter)
    },
    async createUser(login: string, password: string, email: string): Promise<UserViewModel> {
        const createdUser: UserType = {
            id: (+(new Date())).toString(),
            login: login,
            email: email,
            password: "QWERTY1234" + password,
            createdAt: new Date().toISOString()
        }
        return await usersRepo.createUser(createdUser)
    },
    async deleteUser(id: string) : Promise<boolean> {
        return usersRepo.deleteUser(id)
    }



}