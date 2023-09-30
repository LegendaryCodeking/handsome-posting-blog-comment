import {SessionModelClass} from "../db/db";
import {
    SessionDBModel,
    SessionUpdateContentModel, SessionUpdateFilterModel,
    SessionViewModel
} from "../models/Sessions/SessionModel";
import {getSessionViewModel} from "../helpers/map-SessionViewModel";

class SessionsRepo {

    async deleteAllSessions(currentRFTokenIAT: number, deviceId: string): Promise<boolean> {
        try {
            // Mongo native driver code
            // await SessionModelClass.deleteMany({
            //     "RFTokenIAT": {$ne: new Date(currentRFTokenIAT)},
            //     "deviceId": {$ne: deviceId}
            // });

            let sessionInstance = await SessionModelClass.findOne({
                "RFTokenIAT": {$ne: new Date(currentRFTokenIAT)},
                "deviceId": {$ne: deviceId}
            })

            while (sessionInstance) {
                await sessionInstance.deleteOne()
                sessionInstance = await SessionModelClass.findOne({
                    "RFTokenIAT": {$ne: new Date(currentRFTokenIAT)},
                    "deviceId": {$ne: deviceId}
                })
            }

        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }

    async deleteDeviceSessions(deviceId: string): Promise<boolean> {
        // Mongo native driver code
        // const result = await SessionModelClass.deleteOne({"deviceId": deviceId});
        // return result.deletedCount === 1

        const sessionInstance = await SessionModelClass.findOne({"deviceId": deviceId})
        if (!sessionInstance) return false

        await sessionInstance.deleteOne()
        return true
    }

    async registerSession(createdSession: SessionDBModel): Promise<SessionViewModel | null> {
        try {
            // Mongo native driver code
            // const result = await SessionModelClass.insertMany([createdSession]);

            const sessionInstance = new SessionModelClass()

            sessionInstance._id = createdSession._id
            sessionInstance.ip = createdSession.ip
            sessionInstance.title = createdSession.title
            sessionInstance.lastActiveDate = createdSession.lastActiveDate
            sessionInstance.deviceId = createdSession.deviceId
            sessionInstance.deviceName = createdSession.deviceName
            sessionInstance.userId = createdSession.userId
            sessionInstance.RFTokenIAT = createdSession.RFTokenIAT
            sessionInstance.RFTokenObsoleteDate = createdSession.RFTokenObsoleteDate

            await sessionInstance.save()

            return getSessionViewModel(createdSession)
        } catch (e) {
            return null
        }
    }

    async updateSessionInfo(filter: SessionUpdateFilterModel, updateSessionContent: SessionUpdateContentModel): Promise<boolean> {
        // Mongo native driver code
        // let result = await SessionModelClass.updateOne(filter, {
        //     $set: updateSessionContent
        // })
        // return result.matchedCount === 1

        const sessionInstance = await SessionModelClass.findOne(filter)
        if (!sessionInstance) return false

        sessionInstance.ip = updateSessionContent.ip
        sessionInstance.lastActiveDate = updateSessionContent.lastActiveDate
        sessionInstance.deviceName = updateSessionContent.deviceName
        sessionInstance.RFTokenIAT = updateSessionContent.RFTokenIAT
        sessionInstance.RFTokenObsoleteDate = updateSessionContent.RFTokenObsoleteDate

        await sessionInstance.save()
        return true
    }

    async deleteSession(currentRFTokenIAT: number, userId: string): Promise<boolean> {
        // Mongo native driver code
        // let result = await SessionModelClass.deleteOne({"RFTokenIAT": new Date(currentRFTokenIAT), "userId": userId})
        // return result.deletedCount === 1

        const sessionInstance = await SessionModelClass.findOne({"RFTokenIAT": new Date(currentRFTokenIAT), "userId": userId})
        if (!sessionInstance) return false

        await sessionInstance.deleteOne()
        return true
    }
}

export const sessionsRepo = new SessionsRepo()