import {ObjectId} from "mongodb";

export type rateLimitDBModel = {
    _id: ObjectId
    IP: string | string[]
    URL: string
    date: Date
}

export type rateLimitViewModel = {
    IP: string | string[]
    URL: string
    date: Date
}