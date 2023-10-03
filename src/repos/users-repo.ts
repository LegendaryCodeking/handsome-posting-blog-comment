import {UserDBModel} from "../models/Users/UserModel";
import {UserViewModel} from "../models/Users/UserModel";
import {UserModelClass} from "../db/db";
import {getUserViewModel} from "../helpers/map-UserViewModel";
import {createObjectIdFromSting} from "../helpers/map-ObjectId";
import {ObjectId} from "mongodb";
import {injectable} from "inversify";

@injectable()
export class UsersRepo {
    async createUser(createdUser: UserDBModel): Promise<UserViewModel> {
        // Mongo native driver code
        // await UserModelClass.insertMany([createdUser])

        const userInstance = new UserModelClass()

        userInstance._id = createdUser._id
        userInstance.accountData = createdUser.accountData
        userInstance.emailConfirmation = createdUser.emailConfirmation
        userInstance.passwordRecovery = createdUser.passwordRecovery

        await userInstance.save()

        return getUserViewModel(createdUser)
    }
    async deleteUser(id: string): Promise<boolean> {
        // Mongo native driver code
        // const result = await UserModelClass.deleteOne({"id": id});
        // return result.deletedCount === 1
        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const userInstance = await UserModelClass.findOne({"_id": _id})
        if (!userInstance) return false

        await userInstance.deleteOne()

        return true
    }
    async updateConfirmation(id: string): Promise<boolean> {
        // Mongo native driver code
        // const result = await UserModelClass.updateOne({"id": id}, {$set: {"emailConfirmation.isConfirmed": true}});
        // return result.matchedCount === 1
        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const userInstance = await UserModelClass.findOne({"_id": _id})
        if (!userInstance) return false

        userInstance.emailConfirmation.isConfirmed = true

        await userInstance.save()

        return true
    }
    async updateUserEmailConfirmationInfo(_id: ObjectId, user: UserDBModel): Promise<boolean> {
        // Mongo native driver code
        // const result = await UserModelClass.replaceOne({"id": id}, user)
        // return result.modifiedCount === 1

        const userInstance = await UserModelClass.findOne({"_id": _id})
        if (!userInstance) return false

        await userInstance.replaceOne(user)

        return true
    }
    async addPassRecoveryCode(id: string, passwordRecoveryCode: string): Promise<boolean> {
        // Mongo native driver code
        // const result = await UserModelClass.updateOne({"id": id}, {
        //     $set: {
        //         "passwordRecovery.passwordRecoveryCode": passwordRecoveryCode,
        //         "passwordRecovery.active": true
        //     }
        // });
        // return result.matchedCount === 1

        const _id = createObjectIdFromSting(id)
        if (_id === null) return false
        const userInstance = await UserModelClass.findOne({"_id": _id})
        if (!userInstance) return false

        userInstance.passwordRecovery.passwordRecoveryCode = passwordRecoveryCode
        userInstance.passwordRecovery.active = true

        await userInstance.save()

        return true
    }
    async updatePassword(newPassword: string, userId: string): Promise<boolean> {
        // Mongo native driver code
        // const result = await UserModelClass.updateOne({"id": userId}, {
        //     $set: {
        //         "accountData.password": newPassword,
        //         "passwordRecovery.active": false
        //     }
        // });
        // return result.matchedCount === 1

        const _id = createObjectIdFromSting(userId)
        if (_id === null) return false
        const userInstance = await UserModelClass.findOne({"_id": _id})
        if (!userInstance) return false

        userInstance.accountData.password = newPassword
        userInstance.passwordRecovery.active = false

        await userInstance.save()

        return true
    }
    async findByLoginOrEmail(loginOrEmail: string): Promise<UserDBModel | null> {
        const user = await UserModelClass.findOne({$or: [{"accountData.email": loginOrEmail}, {"accountData.login": loginOrEmail}]})
        if (user) {
            return user
        }
        return null
    }
    async findUserByConfirmationCode(code: string) {
        let user = await UserModelClass.findOne({"emailConfirmation.confirmationCode": code})
        if (user) {
            return user
        } else {
            return null
        }
    }
    async findUserByPassRecoveryCode(code: string) {
        let user = await UserModelClass.findOne({"passwordRecovery.passwordRecoveryCode": code})
        if (user) {
            return user
        } else {
            return null
        }
    }
}