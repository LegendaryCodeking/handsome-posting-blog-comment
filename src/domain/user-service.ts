import {FilterModel} from "../models/FilterModel";
import {usersRepo} from "../repos/users-repo";
import {UsersWithPaginationModel} from "../models/UsersWithPaginationModel";
import {UserViewModel} from "../models/UserViewModel";
import {UserType} from "../models/UserModel";
import bcrypt from 'bcrypt';

export const userService = {
    async findUsers(queryFilter: FilterModel): Promise<UsersWithPaginationModel> {
        return usersRepo.findUsers(queryFilter)
    },
    async createUser(login: string, password: string, email: string): Promise<UserViewModel> {

        const passwordSalt = await bcrypt.genSalt(14)
        const passwordHash = await this._generateHash(password,passwordSalt)

        const createdUser: UserType = {
            id: (+(new Date())).toString(),
            login: login,
            email: email,
            password: passwordHash,
            createdAt: new Date().toISOString()
        }
        return await usersRepo.createUser(createdUser)
    },
    async deleteUser(id: string): Promise<boolean> {
        return usersRepo.deleteUser(id)
    },
    async _generateHash(password: string, salt: string) {
        return await bcrypt.hash(password, salt)
    },
    async checkCredentials(loginOrEmail: string,password: string) {
        const user = await usersRepo.findByLoginOrEmail(loginOrEmail)
        if(!user) return false
        //@ts-ignore
        const salt = user.password.split("$").pop().substr(0,22)
        const passwordHash = await this._generateHash(password,salt)
        return user.password === passwordHash;

    }


}