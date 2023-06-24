import {UserDBModel} from "../models/Users/UserModel";
import {UserViewModel} from "../models/Users/UserModel";
import {refreshTokenCollection, usersCollection} from "../db/db";
import {getUserViewModel} from "../helpers/map-UserViewModel";
import {RefreshTokenDbModel, RefreshTokenViewModel} from "../models/Tokens/refreshToken-model";


export const usersRepo = {

    async createUser(createdUser: UserDBModel): Promise<UserViewModel> {
        await usersCollection.insertOne(createdUser)

        return getUserViewModel(createdUser)
    },

    async deleteUser(id: string): Promise<boolean> {
        const result = await usersCollection.deleteOne({"id": id});
        return result.deletedCount === 1
    },

    async updateConfirmation(id: string): Promise<boolean>  {
        const result = await usersCollection.updateOne({"id": id},{$set: {"emailConfirmation.isConfirmed": true}});
        return result.matchedCount === 1
    },

    async updateUserEmailConfirmationInfo(id: string, user: UserDBModel): Promise<boolean>  {
        const result = await usersCollection.replaceOne({"id":id}, user)
        return result.modifiedCount === 1
    },

    async addRefreshToken(refrToken: RefreshTokenDbModel): Promise<boolean> {
        let result = await refreshTokenCollection.insertOne(refrToken)
        return result.insertedId !== undefined
    },
    async deactivateRefreshToken(refreshToken: RefreshTokenViewModel): Promise<boolean>  {
        const result = await refreshTokenCollection.updateOne({"refreshToken": refreshToken.refreshToken},{$set: {isAlive: false}});
        return result.matchedCount === 1

    }
}