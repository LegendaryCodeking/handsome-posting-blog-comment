import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {UserViewModel} from "../models/Users/UserModel";
import {injectable} from "inversify";

dotenv.config()

@injectable()
export class JwtService {
    async createJWT(user: UserViewModel) {
        return jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: '2000s'})
    }

    async createPassRecoveryCode(user: UserViewModel) {
        return jwt.sign({userId: user.id}, process.env.JWT_SECRET!, {expiresIn: '4000s'})
    }

    async createJWTRefresh(user: UserViewModel, deviceId: string): Promise<string> {
        return jwt.sign({userId: user.id, deviceId: deviceId}, process.env.JWT_SECRET!, {expiresIn: '4000s'})
    }

    async getInfoFromRFToken(refreshToken: string) {
        try {
            const result: any = jwt.verify(refreshToken, process.env.JWT_SECRET!)
            return {
                "deviceId": result.deviceId,
                "iat": result.iat * 1000,
                "userId": result.userId
            }
        } catch (e) {
            return null
        }
    }
}

export const jwtService = new JwtService