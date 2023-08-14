import {sessionsCollection} from "../db/db";
import {
    SessionDBModel,
    SessionUpdateContentModel,
    SessionViewModel
} from "../models/Sessions/SessionModel";
import {getSessionViewModel} from "../helpers/map-SessionViewModel";
import {Filter} from "mongodb";


export const sessionsRepo = {
    async deleteAllSessions(currentRFTokenIAT: number, deviceId: string): Promise<boolean> {
        try {
            await sessionsCollection.deleteMany({
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
    async updateSessionInfo(filter: Filter<SessionDBModel>, updateSessionContent: SessionUpdateContentModel) {
        let result = await sessionsCollection.updateOne(filter, {
            $set: updateSessionContent
        })
        return result.matchedCount === 1
    },
    async deleteSession(currentRFTokenIAT: number, userId: string) {
        let result = await sessionsCollection.deleteOne({"RFTokenIAT": new Date(currentRFTokenIAT), "userId": userId})
        return result.deletedCount === 1
    }
}