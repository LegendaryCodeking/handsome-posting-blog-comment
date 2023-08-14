import {Request, Response} from "express";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {sessionsQueryRepo} from "../repos/query-repos/sessions-query-repo";
import {sessionsService} from "../domain/sessions-service";
import {RequestWithParamsSessions} from "../types/sessions-types";
import {URIParamsSessionDeviceIdModel} from "../models/Sessions/URIParamsSessionDeviceIdModel";
import {jwtService} from "../application/jwt-service";

export const securityController = {

    async findAllSessions(req: Request, res: Response) {
        let foundSessions = await sessionsQueryRepo.FindAllSessions()

        if (!foundSessions.length) {
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
    async terminateDeviceSessions(req: RequestWithParamsSessions<URIParamsSessionDeviceIdModel>, res: Response){
        const currentUserID = await jwtService.getUserIdByToken(req.cookies.refreshToken)
        if (currentUserID === null) {
            res.sendStatus(STATUSES_HTTP.SERVER_ERROR_500)
            return
        }
        const ownerOfDeletedSession = await sessionsQueryRepo.findUserIdByDeviceId(req.params.deviceId)
        if (ownerOfDeletedSession === null) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return
        }

        if (currentUserID !== ownerOfDeletedSession ) {
            res.sendStatus(STATUSES_HTTP.FORBIDDEN_403)
            return;
        }

        let deleteStatus: boolean = await sessionsService.deleteDeviceSessions(req.params.deviceId)
        if (deleteStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
}