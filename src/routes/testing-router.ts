import {Request, Response, Router} from "express";
import {STATUSES_HTTP} from "../enum/http-statuses";
import {PostModel} from "../db/db";

export const testingRouter = Router({})


testingRouter.delete('/all-data', async (req: Request, res: Response) => {
    await Promise.all([
        // blogsCollection.deleteMany({}),
        PostModel.deleteMany({}),
        // commentsCollection.deleteMany({}),
        // usersCollection.deleteMany({}),
        // sessionsCollection.deleteMany({}),
        // rateLimitingCollection.deleteMany({})
    ]).catch((e) => {
        console.log(e)
        return res.sendStatus(STATUSES_HTTP.SERVER_ERROR_500)
    })

    return res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})