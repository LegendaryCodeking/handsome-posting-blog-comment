import {usersRepo} from "../repos/users-repo";
import {UserDBModel, UserViewModel} from "../models/Users/UserModel";
import bcrypt from 'bcrypt';
import {usersQueryRepo} from "../repos/query-repos/users-query-repo";
import {getUserViewModel} from "../helpers/map-UserViewModel";
import {v4 as uuidv4} from 'uuid';
import add from 'date-fns/add'
import {emailManager} from "../managers/email-manager";
import {jwtService} from "../application/jwt-service";

export const userService = {
    async createUser(login: string, password: string, email: string, isAuthorSuper: boolean): Promise<UserViewModel | null> {

        const passwordHash = await bcrypt.hash(password, 10) //Соль генерируется автоматически за 10 кругов - второй параметр

        const createdUser: UserDBModel = {
            id: (+(new Date())).toString(),
            accountData: {
                login: login,
                email: email,
                password: passwordHash,
                createdAt: new Date().toISOString()
            },
            emailConfirmation: {
                confirmationCode: uuidv4(),
                expirationDate: add(new Date(), {
                    hours: 1,
                    minutes: 3
                }).toISOString(),
                isConfirmed: false
            }
        }

        if (isAuthorSuper) {
            createdUser.emailConfirmation.isConfirmed = true
            return await usersRepo.createUser(createdUser)
        } else {

            let resultUser = await usersRepo.createUser(createdUser)
            try {
                await emailManager.sendEmailConfirmationMessage(createdUser)
            } catch (e) {
                console.log(e)
                return null;
            }
            return resultUser

        }


    },
    async deleteUser(id: string): Promise<boolean> {
        return await usersRepo.deleteUser(id)
    },

    async checkCredentials(loginOrEmail: string, password: string): Promise<UserViewModel | null> {
        const user = await usersQueryRepo.findByLoginOrEmail(loginOrEmail)
        if (!user) return null


        const passHash = user.accountData.password

       const result = await bcrypt.compare(password, passHash).then(function (result) {
            return result
        });

        if (result) {
            return getUserViewModel(user);
        }
        return null

    },
    async recoveryPassword(email: string): Promise<boolean> {
        const userDB = await usersQueryRepo.findByLoginOrEmail(email)
        // Return true even if current email is not registered (for prevent user's email detection)
        if (!userDB) return true
        const user = getUserViewModel(userDB)
        const passwordRecoveryCode = await jwtService.createPassRecoveryCode(user)
        await usersRepo.addPassRecoveryCode(user.id,passwordRecoveryCode)

        try {
            await emailManager.sendPasswordRecoveryMessage(user.email,passwordRecoveryCode)
            return true
        } catch (e) {
            console.log(e)
            return false;
        }

    },
    async updatePassword(newPassword: string, userId: string): Promise<boolean> {
        const passwordHash = await bcrypt.hash(newPassword, 10) //Соль генерируется автоматически за 10 кругов - второй параметр
        return await usersRepo.updatePassword(passwordHash, userId)
    }
}