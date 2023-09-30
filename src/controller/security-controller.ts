import {Request, Response} from "express";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {sessionsQueryRepo} from "../repos/query-repos/sessions-query-repo";
import {sessionsService} from "../domain/sessions-service";
import {URIParamsSessionDeviceIdModel} from "../models/Sessions/URIParamsSessionDeviceIdModel";
import {jwtService} from "../application/jwt-service";
import {RequestsWithParams} from "../models/requestModels";

class SecurityController {
    async findAllSessions(req: Request, res: Response) {
        let RFTokenInfo = await jwtService.getInfoFromRFToken(req.cookies.refreshToken)
        if (RFTokenInfo === null) {
            res.sendStatus(STATUSES_HTTP.SERVER_ERROR_500)
            return
        }
        let foundSessions = await sessionsQueryRepo.FindAllSessions(RFTokenInfo.userId)

        if (!foundSessions.length) {
            res.status(STATUSES_HTTP.NOT_FOUND_404)
                .json(foundSessions);
            return;
        }
        res.status(STATUSES_HTTP.OK_200)
            .json(foundSessions)
    }

    async terminateAllSessions(req: Request, res: Response) {

        const RFTokenInfo = await jwtService.getInfoFromRFToken(req.cookies.refreshToken)
        if (RFTokenInfo === null) {
            res.sendStatus(STATUSES_HTTP.SERVER_ERROR_500)
            return
        }

        let deleteStatus: boolean = await sessionsService.deleteAllSessions(RFTokenInfo.iat, RFTokenInfo.deviceId)
        if (deleteStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }

    async terminateDeviceSessions(req: RequestsWithParams<URIParamsSessionDeviceIdModel>, res: Response) {
        const RFTokenInfo = await jwtService.getInfoFromRFToken(req.cookies.refreshToken)
        if (RFTokenInfo === null) {
            res.sendStatus(STATUSES_HTTP.SERVER_ERROR_500)
            return
        }
        const ownerOfDeletedSession = await sessionsQueryRepo.findUserIdByDeviceId(req.params.deviceId)
        if (ownerOfDeletedSession === null) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return
        }

        if (RFTokenInfo.userId !== ownerOfDeletedSession) {
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

export const securityController = new SecurityController()