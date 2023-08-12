import {sessionsCollection} from "../db/db";
import {
    SessionDBModel,
    SessionUpdateContentModel,
    SessionUpdateFilterModel,
    SessionViewModel
} from "../models/Sessions/SessionModel";
import {getSessionViewModel} from "../helpers/map-SessionViewModel";


export const sessionsRepo = {
    async deleteAllSessions(): Promise<boolean> {
        try {
            await sessionsCollection.deleteMany({});
        } catch (e) {
            console.log(e)
            return false
        }
        return true
    },
    async deleteDeviceSessions(deviceId: string): Promise<boolean>  {
        const result = await sessionsCollection.deleteOne({"deviceId": deviceId});
        return result.deletedCount === 1
    },
    async registerSession(createdSession: SessionDBModel): Promise<SessionViewModel | null> {
        try {
            const result = await sessionsCollection.insertOne(createdSession);
            return getSessionViewModel(createdSession)
        } catch (e) {
            return null
        }
    },
    async updateSessionInfo(filter: SessionUpdateFilterModel, updateSessionContent: SessionUpdateContentModel) {
        let result = await sessionsCollection.updateOne({filter}, {
            $set: updateSessionContent
        })
        return result.matchedCount === 1
    },
    async deleteSession(currentRFTokenIAT: number, userId: string) {
        let result = await sessionsCollection.deleteOne({"RFTokenIAT": new Date(currentRFTokenIAT), "userId": userId})
        return result.deletedCount === 1
    }
}