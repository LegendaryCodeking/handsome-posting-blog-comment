import {sessionsRepo} from "../repos/sessions-repo";

export const sessionsService = {

    async deleteAllSessions(): Promise<boolean> {
        return sessionsRepo.deleteAllSessions()
    },
    async deleteDeviceSessions(deviceId: string): Promise<boolean> {
        return sessionsRepo.deleteDeviceSessions(deviceId)
    }
}