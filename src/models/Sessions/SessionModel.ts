import {WithId} from "mongodb";
import mongoose from "mongoose";

export type SessionDBModel = WithId<{
    "ip": string | string[]
    "title": string
    "lastActiveDate": string
    "deviceId": string
    "deviceName": string | string[]
    "userId": string
    "RFTokenIAT": Date
    "RFTokenObsoleteDate": Date
}>

export type SessionViewModel = {
    "ip": string | string[]
    "title": string
    "lastActiveDate": string
    "deviceId": string
}

export type SessionUpdateFilterModel = {
    "RFTokenIAT": Date
    "deviceId": string
    "userId": string
}

export type SessionUpdateContentModel = {
    "ip": string | string[]
    "lastActiveDate": string
    "RFTokenIAT": Date
    "deviceName": string | string[]
}

export const sessionMongooseSchema = new mongoose.Schema<SessionDBModel>({
    "ip": String || [String],
    "title": String,
    "lastActiveDate": String,
    "deviceId": String,
    "deviceName": String || [String],
    "userId": String,
    "RFTokenIAT": Date,
    "RFTokenObsoleteDate": Date
})
