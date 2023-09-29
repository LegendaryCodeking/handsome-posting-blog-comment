import {UserDBModel} from "../models/Users/UserModel";
import {UserViewModel} from "../models/Users/UserModel";
import {UserModelClass} from "../db/db";
import {getUserViewModel} from "../helpers/map-UserViewModel";


export const usersRepo = {

    async createUser(createdUser: UserDBModel): Promise<UserViewModel> {
        await UserModelClass.insertMany([createdUser])

        return getUserViewModel(createdUser)
    },
    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModelClass.deleteOne({"id": id});
        return result.deletedCount === 1
    },
    async updateConfirmation(id: string): Promise<boolean> {
        const result = await UserModelClass.updateOne({"id": id}, {$set: {"emailConfirmation.isConfirmed": true}});
        return result.matchedCount === 1
    },
    async updateUserEmailConfirmationInfo(id: string, user: UserDBModel): Promise<boolean> {
        const result = await UserModelClass.replaceOne({"id": id}, user)
        return result.modifiedCount === 1
    },
    async addPassRecoveryCode(id: string, passwordRecoveryCode: string) {
        const result = await UserModelClass.updateOne({"id": id}, {
            $set: {
                "passwordRecovery.passwordRecoveryCode": passwordRecoveryCode,
                "passwordRecovery.active": true
            }
        });
        return result.matchedCount === 1
    },
    async updatePassword(newPassword: string, userId: string): Promise<boolean> {
        const result = await UserModelClass.updateOne({"id": userId}, {
            $set: {
                "accountData.password": newPassword,
                "passwordRecovery.active": false
            }
        });
        return result.matchedCount === 1
    },

    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        const user = await UserModelClass.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]})
        if (user) {
            return user
        }
        return null
    },
    async findUserByConfirmationCode(code: string) {
        let user = await UserModelClass.findOne({"emailConfirmation.confirmationCode": code})
        if (user) {
            return user
        } else {
            return null
        }
    },
    async findUserByPassRecoveryCode(code: string) {
        let user = await UserModelClass.findOne({"passwordRecovery.passwordRecoveryCode": code})
        if (user) {
            return user
        } else {
            return null
        }
    }

}