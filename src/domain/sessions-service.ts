import {sessionsRepo} from "../repos/sessions-repo";

export const sessionsService = {

    async deleteAllSessions(): Promise<boolean> {
        return await sessionsRepo.deleteAllSessions()
    }
}