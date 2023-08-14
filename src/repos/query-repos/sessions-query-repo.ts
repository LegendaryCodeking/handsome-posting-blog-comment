import {sessionsCollection} from "../../db/db";
import {getSessionViewModel} from "../../helpers/map-SessionViewModel";

export const sessionsQueryRepo = {
    async FindAllSessions(): Promise<any> {
        const foundSessions = await sessionsCollection.find({}).toArray()
        return foundSessions
            .map(session => getSessionViewModel(session));

    },


    async findSessionWithRFToken(RFTIAT: number | null, deviceId: string) {
        if (RFTIAT === null) return null
        let foundSession = await sessionsCollection.findOne({"RFTokenIAT": new Date(RFTIAT), "deviceId": deviceId})
        if (foundSession) {
            return getSessionViewModel(foundSession)
        } else {
            return null
        }


    },

    async findUserIdByDeviceId(deviceId: string) {
        let foundSession = await sessionsCollection.findOne({"deviceId": deviceId})
        if (foundSession) {
            return foundSession.userId
        } else {
            return null
        }
    }
}