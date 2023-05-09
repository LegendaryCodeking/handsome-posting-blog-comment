import {NextFunction, Request, Response, Router} from 'express'
import {body, validationResult} from "express-validator";
import {STATUSES_HTTP} from "../index";
import {blogsRepo} from "../repos/blogs-repo";

const authorizationCheck = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers["authorization"] !== "Basic YWRtaW46cXdlcnR5") {
        res.sendStatus(401)
    } else {
        next();
    }
}
const nameValidation = body("name").trim().isLength({
    min: 1,
    max: 15
}).isString().withMessage(`Name length should be from 1 to 15 symbols`)
const descriptionValidation = body("description").isString().isLength({
    min: 1,
    max: 500
}).withMessage(`Description should be string type`)
const urlValidation = body("websiteUrl").isURL({protocols: ['https']}).isString().isLength({
    min: 1,
    max: 100
}).withMessage("websiteUrl should be correct")

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


export const blogsRouter = Router({})

blogsRouter.get('/', (req: Request, res: Response) => {
    let foundBlogs = blogsRepo.findBlogs()

    if (!foundBlogs.length) {
        res.status(STATUSES_HTTP.NOT_FOUND_404)
            .json(foundBlogs);
        return;
    }
    res.status(STATUSES_HTTP.OK_200)
        .json(foundBlogs)
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    const foundBlog = blogsRepo.findBlogById(req.body.id)
    if (!foundBlog) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    res.json(foundBlog)
})

blogsRouter.delete('/:id', authorizationCheck, (req: Request, res: Response) => {
    let deleteStatus = blogsRepo.deleteBlog(req.body.id)
    if (deleteStatus) {
        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    } else {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
    }
})


blogsRouter.post('/',
    authorizationCheck,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    (req: Request, res: Response) => {
        let createdBlog = blogsRepo.createBlog(req.body.name, req.body.description, req.body.websiteUrl)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdBlog)
    })

blogsRouter.put('/:id',
    authorizationCheck,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    (req: Request, res: Response) => {
        let updateStatus = blogsRepo.updateBlog(req.body.id, req.body.name, req.body.description, req.body.websiteUrl)
        if (updateStatus) {
            res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
        } else {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        }
    }
)