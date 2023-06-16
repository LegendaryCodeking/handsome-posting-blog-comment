import {usersRepo} from "../repos/users-repo";
import {UserViewModel} from "../models/Users/UserViewModel";
import {UserType} from "../models/Users/UserModel";
import bcrypt from 'bcrypt';
import {usersQueryRepo} from "../repos/query-repos/users-query-repo";

export const userService = {
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
    async checkCredentials(loginOrEmail: string,password: string): Promise<UserViewModel | null> {
        const user = await usersQueryRepo.findByLoginOrEmail(loginOrEmail)
        if(!user) return null
        //@ts-ignore
        const passArray = user.password.split("$")
        const salt = `$${passArray[1]}$${passArray[2]}$${passArray[3].substr(0,22)}`
        const passwordHash = await this._generateHash(password,salt)
        if(user.password === passwordHash) {
            return user;
        } else {
            return null
        }

    }
}