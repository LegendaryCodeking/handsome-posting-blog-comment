import {Router} from "express";
import {postsRepo} from "../repos/posts-repo";
import {STATUSES_HTTP} from "./http-statuses-const";
import {blogsService} from "../domain/blogs-service";

export const testingRouter = Router({})


testingRouter.delete('/all-data', (req, res) => {
    blogsService.deleteAll();
    postsRepo.deleteAll();
    res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})