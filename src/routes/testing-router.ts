import {Router} from "express";
import {STATUSES_HTTP} from "./http-statuses-const";
import {blogsService} from "../domain/blogs-service";
import {postsService} from "../domain/posts-service";

export const testingRouter = Router({})


testingRouter.delete('/all-data', (req, res) => {
    blogsService.deleteAll();
    postsService.deleteAll();
    res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})