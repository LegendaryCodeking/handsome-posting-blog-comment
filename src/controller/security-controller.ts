import {Request, Response} from "express";
import {BlogsWithPaginationModel} from "../models/BLogs/BlogsWithPaginationModel";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {sessionsQueryRepo} from "../repos/query-repos/sessions-query-repo";
import {sessionsService} from "../domain/sessions-service";

export const securityController = {

    async findAllSessions(req: Request, res: Response) {
        let foundSessions: BlogsWithPaginationModel = await sessionsQueryRepo.FindAllSessions()

        if (!foundSessions.items.length) {
            res.status(STATUSES_HTTP.NOT_FOUND_404)
                .json(foundSessions);
            return;
        }
        res.status(STATUSES_HTTP.OK_200)
            .json(foundSessions)
    },
    async terminateAllSessions(req: Request, res: Response) {
        let deleteStatus: boolean = await sessionsService.deleteAllSessions()
        if (deleteStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    },
    async terminateDeviceSessions(req: Request, res: Response){

    }
}