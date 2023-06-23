import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {UserViewModel} from "../models/Users/UserModel";
dotenv.config()


export const jwtService = {
    async createJWT(user: UserViewModel) {
        return jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: '10s'})
    },
    async createJWTRefresh(user: UserViewModel) {
        return jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: '20s'})
    },
    async getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, process.env.JWT_SECRET!)
            return result.userId
        } catch (e) {
            return null
        }
    }

}