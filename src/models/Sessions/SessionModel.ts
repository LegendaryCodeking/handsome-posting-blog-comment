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
    "RFTokenObsoleteDate": Date
}

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