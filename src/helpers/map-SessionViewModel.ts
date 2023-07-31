import {SessionDBModel, SessionViewModel} from "../models/Sessions/SessionModel";

export const getSessionViewModel = (session: SessionDBModel): SessionViewModel => {
    return {
        "ip": session.ip,
        "title": session.title,
        "lastActiveDate": session.lastActiveDate,
        "deviceId": session.deviceId
    }
}