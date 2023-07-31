import {ObjectId} from "mongodb";

export type SessionDBModel = {
    _id: ObjectId
    "ip": string
    "title": string
    "lastActiveDate": string
    "deviceId": string
}

export type SessionViewModel = {
    "ip": string
    "title": string
    "lastActiveDate": string
    "deviceId": string
}