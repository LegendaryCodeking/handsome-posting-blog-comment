import {sessionsCollection} from "../../db/db";
import {getSessionViewModel} from "../../helpers/map-SessionViewModel";

export const sessionsQueryRepo = {
    async FindAllSessions(): Promise<any> {

        return await sessionsCollection
            .find()
            .map(session => getSessionViewModel(session)).toArray();

    }
}