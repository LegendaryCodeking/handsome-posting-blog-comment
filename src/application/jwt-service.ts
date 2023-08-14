import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {UserViewModel} from "../models/Users/UserModel";
import {ObjectId} from "mongodb";
import {RefreshTokenDbModel} from "../models/Tokens/refreshToken-model";
dotenv.config()


export const jwtService = {
    async createJWT(user: UserViewModel) {
        return jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: '10s'})
    },

    async createJWTRefresh(user: UserViewModel, deviceId: string): Promise<RefreshTokenDbModel> {
        let refrToken = {
            _id: new ObjectId(),
            refreshToken: jwt.sign({userId: user.id, deviceId: deviceId}, process.env.JWT_SECRET!, {expiresIn: '20000s'}),
            isAlive: true
        }

        return refrToken
    },

    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            return result.userId
        } catch (e) {
            return null
        }
    },

    async getIAT(refreshToken: string) {
        try {
            const result: any = jwt.verify(refreshToken, process.env.JWT_SECRET!)
            return result.iat * 1000
        } catch (e) {
            return null
        }
    },
    async getDeviceId(refreshToken: string) {
        try {
            const result: any = jwt.verify(refreshToken, process.env.JWT_SECRET!)
            return result.deviceId.toString()
        } catch (e) {
            return null
        }
    }
}