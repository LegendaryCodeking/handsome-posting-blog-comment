import {UserDBModel} from "../models/Users/UserModel";
import {UserViewModel} from "../models/Users/UserModel";
import {UserModel} from "../db/db";
import {getUserViewModel} from "../helpers/map-UserViewModel";


export const usersRepo = {

    async createUser(createdUser: UserDBModel): Promise<UserViewModel> {
        await UserModel.insertMany([createdUser])

        return getUserViewModel(createdUser)
    },

    async deleteUser(id: string): Promise<boolean> {
        const result = await UserModel.deleteOne({"id": id});
        return result.deletedCount === 1
    },

    async updateConfirmation(id: string): Promise<boolean> {
        const result = await UserModel.updateOne({"id": id}, {$set: {"emailConfirmation.isConfirmed": true}});
        return result.matchedCount === 1
    },

    async updateUserEmailConfirmationInfo(id: string, user: UserDBModel): Promise<boolean> {
        const result = await UserModel.replaceOne({"id": id}, user)
        return result.modifiedCount === 1
    },
    async addPassRecoveryCode(id: string, passwordRecoveryCode: string) {
        const result = await UserModel.updateOne({"id": id}, {
            $set: {
                "passwordRecovery.passwordRecoveryCode": passwordRecoveryCode,
                "passwordRecovery.active": true
            }
        });
        return result.matchedCount === 1
    },
    async updatePassword(newPassword: string, userId: string): Promise<boolean> {
        const result = await UserModel.updateOne({"id": userId}, {
            $set: {
                "accountData.password": newPassword,
                "passwordRecovery.active": false
            }
        });
        return result.matchedCount === 1
    }
}