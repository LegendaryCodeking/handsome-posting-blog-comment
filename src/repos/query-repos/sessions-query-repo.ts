import {sessionsCollection} from "../../db/db";
import {getSessionViewModel} from "../../helpers/map-SessionViewModel";
import {jwtService} from "../../application/jwt-service";

export const sessionsQueryRepo = {
    async FindAllSessions(): Promise<any> {

        return await sessionsCollection
            .find()
            .map(session => getSessionViewModel(session)).toArray();

    },


    async findSessionWithRFToken(refreshTokenCookie: string, deviceId: string) {

        const RFTIAT = await jwtService.getIAT(refreshTokenCookie)
        if (RFTIAT === null) return null
        let foundSession = await sessionsCollection.findOne({"RFTokenIAT": new Date(RFTIAT), "deviceId": deviceId})
        if (foundSession) {
            return getSessionViewModel(foundSession)
        } else {
            return null
        }


    }
}