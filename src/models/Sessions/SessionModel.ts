import {ObjectId} from "mongodb";

export type SessionDBModel = {
    _id: ObjectId
    "ip": string | string[]
    "title": string
    "lastActiveDate": string
    "deviceId": string
    "deviceName": string | string[]
    "userId": string
    "RFTokenIAT": Date
}

export type SessionViewModel = {
    "ip": string | string[]
    "title": string
    "lastActiveDate": string
    "deviceId": string
}