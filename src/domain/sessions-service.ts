import {SessionsRepo} from "../repos/sessions-repo";
import {SessionDBModel, SessionUpdateFilterModel, SessionViewModel} from "../models/Sessions/SessionModel";
import {ObjectId} from "mongodb";
import add from "date-fns/add";
import {inject, injectable} from "inversify";

@injectable()
export class SessionsService {

    constructor(
        @inject(SessionsRepo) protected sessionsRepo: SessionsRepo
    ) {
    }

    async deleteAllSessions(currentRFTokenIAT: number, deviceId: string): Promise<boolean> {
        return this.sessionsRepo.deleteAllSessions(currentRFTokenIAT, deviceId)
    }

    async deleteDeviceSessions(deviceId: string): Promise<boolean> {
        return this.sessionsRepo.deleteDeviceSessions(deviceId)
    }

    async registerSession(loginIp: string | string[], RefreshTokenIssuedAt: number,
                          deviceName: string | string[], UserId: string, deviceId: string):
        Promise<SessionViewModel | null> {
        const createdSession = new SessionDBModel(
            new ObjectId(),
            loginIp,
            "Title for Session. Need to change in future",
            new Date().toISOString(),
            deviceId,
            deviceName,
            UserId,
            new Date(RefreshTokenIssuedAt),
            add(new Date(RefreshTokenIssuedAt), {
                    seconds: 20
                }
            ))

        return await this.sessionsRepo.registerSession(createdSession)
    }

    async updateSession(currentRFTokenIAT: number, deviceId: string, loginIp: string | string[],
                        RefreshTokenIssuedAt: number, deviceName: string | string[], UserId: string) {

        const filter: SessionUpdateFilterModel = {
            "deviceId": deviceId,
            "RFTokenIAT": new Date(currentRFTokenIAT),
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

        return await this.sessionsRepo.updateSessionInfo(filter, updateSessionContent)

    }

    async deleteSession(currentRFTokenIAT: number, userId: string) {
        return await this.sessionsRepo.deleteSession(currentRFTokenIAT, userId)
    }
}