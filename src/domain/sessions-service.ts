import {sessionsRepo} from "../repos/sessions-repo";
import {SessionDBModel, SessionViewModel} from "../models/Sessions/SessionModel";
import {ObjectId} from "mongodb";

export const sessionsService = {

    async deleteAllSessions(): Promise<boolean> {
        return sessionsRepo.deleteAllSessions()
    },
    async deleteDeviceSessions(deviceId: string): Promise<boolean> {
        return sessionsRepo.deleteDeviceSessions(deviceId)
    },
    async registerSession(loginIp: string | string[], RefreshTokenIssuedAt: number,
                          deviceName: string | string[], UserId: string):
        Promise<SessionViewModel | null> {
        const createdSession: SessionDBModel = {
            _id: new ObjectId(),
            "ip": loginIp,
            "title": "Title for Session. Need to change in future",
            "lastActiveDate": new Date().toISOString(),
            "deviceId": (+(new Date())).toString(),
            "deviceName": deviceName,
            "userId": UserId,
            "RFTokenIAT": new Date(RefreshTokenIssuedAt)
        }

        return await sessionsRepo.registerSession(createdSession)
    }
}