import {ObjectId} from "mongodb";

export type RefreshTokenDbModel = {
    _id: ObjectId
    refreshToken: string
    isAlive: boolean
}

export type RefreshTokenViewModel = {
    refreshToken: string
    isAlive: boolean
}