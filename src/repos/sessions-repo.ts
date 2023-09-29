import {SessionModelClass} from "../db/db";
import {
    SessionDBModel,
    SessionUpdateContentModel, SessionUpdateFilterModel,
    SessionViewModel
} from "../models/Sessions/SessionModel";
import {getSessionViewModel} from "../helpers/map-SessionViewModel";


export const sessionsRepo = {
    async deleteAllSessions(currentRFTokenIAT: number, deviceId: string): Promise<boolean> {
        try {
            await SessionModelClass.deleteMany({
                "RFTokenIAT": {$ne: new Date(currentRFTokenIAT)},
                "deviceId": {$ne: deviceId}
            });
        } catch (e) {
            console.log(e)
            return false
        }
        return true
    },
    async deleteDeviceSessions(deviceId: string): Promise<boolean> {
        const result = await SessionModelClass.deleteOne({"deviceId": deviceId});
        return result.deletedCount === 1
    },
    async registerSession(createdSession: SessionDBModel): Promise<SessionViewModel | null> {
        try {
            const result = await SessionModelClass.insertMany([createdSession]);
            return getSessionViewModel(createdSession)
        } catch (e) {
            return null
        }
    },
    async updateSessionInfo(filter: SessionUpdateFilterModel, updateSessionContent: SessionUpdateContentModel) {
        let result = await SessionModelClass.updateOne(filter, {
            $set: updateSessionContent
        })
        return result.matchedCount === 1
    },
    async deleteSession(currentRFTokenIAT: number, userId: string) {
        let result = await SessionModelClass.deleteOne({"RFTokenIAT": new Date(currentRFTokenIAT), "userId": userId})
        return result.deletedCount === 1
    }
}