import {Request, Response, Router} from "express";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {PostModel, BlogModel, UserModel} from "../db/db";

export const testingRouter = Router({})


testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await Promise.all([
        BlogModel.deleteMany({}),
        PostModel.deleteMany({}),
        // commentsCollection.deleteMany({}),
        UserModel.deleteMany({}),
        // sessionsCollection.deleteMany({}),
        // rateLimitingCollection.deleteMany({})
    ]).catch((e) => {
        console.log(e)
        return res.sendStatus(STATUSES_HTTP.SERVER_ERROR_500)
    })

    return res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})