import {ObjectId} from "mongodb";
import mongoose from "mongoose";

export class SessionDBModel {
    constructor(
        public _id: ObjectId,
        public ip: SessionIpModel,
        public title: string,
        public lastActiveDate: string,
        public deviceId: string,
        public deviceName: DeviceNameModel,
        public userId: string,
        public RFTokenIAT: Date,
        public RFTokenObsoleteDate: Date
    ) {
    }
}

// export type SessionDBModel = WithId<{
//     "ip": SessionIpModel
//     "title": string
//     "lastActiveDate": string
//     "deviceId": string
//     "deviceName": DeviceNameModel
//     "userId": string
//     "RFTokenIAT": Date
//     "RFTokenObsoleteDate": Date
// }>

type SessionIpModel = string | string[]
type DeviceNameModel = string | string[]

export type SessionViewModel = {
    "ip": SessionIpModel
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
    "ip": SessionIpModel
    "lastActiveDate": string
    "RFTokenIAT": Date
    "deviceName": DeviceNameModel
    RFTokenObsoleteDate: Date
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
