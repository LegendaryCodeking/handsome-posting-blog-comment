import {sessionsRepo} from "../repos/sessions-repo";
import {SessionDBModel, SessionViewModel} from "../models/Sessions/SessionModel";
import {ObjectId} from "mongodb";
import add from "date-fns/add";

export const sessionsService = {

    async deleteAllSessions(): Promise<boolean> {
        return sessionsRepo.deleteAllSessions()
    },
    async deleteDeviceSessions(deviceId: string): Promise<boolean> {
        return sessionsRepo.deleteDeviceSessions(deviceId)
    },
    async registerSession(loginIp: string | string[], RefreshTokenIssuedAt: number,
                          deviceName: string | string[], UserId: string, deviceId: string):
        Promise<SessionViewModel | null> {
        const createdSession: SessionDBModel = {
            _id: new ObjectId(),
            "ip": loginIp,
            "title": "Title for Session. Need to change in future",
            "lastActiveDate": new Date().toISOString(),
            "deviceId": deviceId,
            "deviceName": deviceName,
            "userId": UserId,
            "RFTokenIAT": new Date(RefreshTokenIssuedAt),
            "RFTokenObsoleteDate": add(new Date(RefreshTokenIssuedAt), {
                seconds: 20
            })
        }

        return await sessionsRepo.registerSession(createdSession)
    },
    async updateSession(currentRFTokenIAT: number, deviceId: string, loginIp: string | string[],
                  RefreshTokenIssuedAt: number, deviceName: string | string[], UserId: string) {

        const filter = {
            "deviceId" : deviceId,
            "RFTokenIAT": currentRFTokenIAT,
            "userId": UserId
        }

        const updateSessionContent = {
            "ip": loginIp,
            "lastActiveDate": new Date().toISOString(),
            "deviceName": deviceName,
            "RFTokenIAT": new Date(RefreshTokenIssuedAt),
            "RFTokenObsoleteDate": add(new Date(RefreshTokenIssuedAt), {
                seconds: 20
            })
        }

        return await sessionsRepo.updateSessionInfo(filter,updateSessionContent)

    },
    async deleteSession(currentRFTokenIAT: number, userId: string) {
        return await sessionsRepo.deleteSession(currentRFTokenIAT,userId)
    }
}