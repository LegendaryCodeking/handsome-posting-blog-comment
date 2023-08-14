import {sessionsCollection} from "../../db/db";
import {getSessionViewModel} from "../../helpers/map-SessionViewModel";
import {SessionViewModel} from "../../models/Sessions/SessionModel";

export const sessionsQueryRepo = {
    async FindAllSessions(userId: string): Promise<Array<SessionViewModel>> {
        const foundSessions = await sessionsCollection.find({"userId": userId}).toArray()
        return foundSessions
            .map(session => getSessionViewModel(session));

    },


    async findSessionWithRFToken(RFTIAT: number, deviceId: string) {
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