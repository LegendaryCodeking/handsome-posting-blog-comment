import {NextFunction, Request, Response, Router} from 'express'
import {body, validationResult} from "express-validator";
import {STATUSES_HTTP} from "../index";
import {db_blogs} from "./blogs-router";
import {postsRepo} from "../repos/posts-repo";

const authorizationCheck = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401)
    } else {
        next();
    }
}
const titleValidation = body("title").isString().withMessage("Title should be string").trim().isLength({
    min: 1,
    max: 15
}).withMessage("The length should be from 1 to 15 symbols")
const shortDescription = body("shortDescription").isString().withMessage("shortDescription should be string").trim().isLength({
    min: 1,
    max: 100
}).withMessage("The length should be from 1 to 100 symbols")
const content = body("content").isString().withMessage("content should be string").trim().isLength({
    min: 1,
    max: 1000
}).withMessage("The length should be from 1 to 1000 symbols")
const blogId = body('blogId').isString().withMessage("blogId should be string").trim().isLength({min: 1}).withMessage("The length should be > 0").custom(async value => {
    const foundBlog = await db_blogs.blogs.find(c => +c.id === +value);
    if (!foundBlog) {
        throw new Error('There is no blog with such ID');
    }
})


const inputValidationMw = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        res.status(STATUSES_HTTP.BAD_REQUEST_400)
            .json({
                errorsMessages: result.array({onlyFirstError: true}).map(val => ({
                    "message": val.msg,
                    //@ts-ignore
                    "field": val["path"]
                }))
            });
    } else {
        next();
    }
}


export const postsRouter = Router({})

postsRouter.get('/', (req: Request, res: Response) => {
    let foundPosts = postsRepo.findPosts();
    if (!foundPosts.length) {
        res.status(STATUSES_HTTP.NOT_FOUND_404)
            .json(foundPosts);
        return;
    }
    res.status(STATUSES_HTTP.OK_200)
        .json(foundPosts)
})

postsRouter.get('/:id', (req: Request, res: Response) => {
    const foundPost = postsRepo.findProductById(req.body.id);

    if (!foundPost) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    res.json(foundPost)
})

postsRouter.delete('/:id', authorizationCheck, (req: Request, res: Response) => {
    const deletionStatus = postsRepo.deletePost(req.body.id)
    if (deletionStatus) {
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    } else {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
    }
})

postsRouter.post('/',
    authorizationCheck,
    titleValidation,
    shortDescription,
    content,
    blogId,
    inputValidationMw,
    (req: Request, res: Response) => {
        let createdPost = postsRepo.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdPost)
    })

postsRouter.put('/:id',
    authorizationCheck,
    titleValidation,
    shortDescription,
    content,
    blogId,
    inputValidationMw,
    (req: Request, res: Response) => {
        let updateStatus = postsRepo.updatePost(req.body.id, req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)
        if (updateStatus) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
)