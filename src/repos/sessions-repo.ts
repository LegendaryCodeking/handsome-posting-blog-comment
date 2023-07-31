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
    },
    async deleteDeviceSessions(deviceId: string): Promise<boolean>  {
        const result = await sessionsCollection.deleteOne({"deviceId": deviceId});
        return result.deletedCount === 1
    }
}