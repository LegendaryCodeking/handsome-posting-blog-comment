import {sessionsCollection} from "../db/db";


export const sessionsRepo = {
    async deleteAllSessions(): Promise<boolean> {
        try {
            await sessionsCollection.deleteMany({});
        } catch (e) {
            console.log(e)
            return false
        }
        return true
    }
}