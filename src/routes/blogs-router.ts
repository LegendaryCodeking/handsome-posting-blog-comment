import {Request, Response, Router} from 'express'
import {STATUSES_HTTP} from "../index";
import {blogsRepo} from "../repos/blogs-repo";
import {descriptionValidation, nameValidation, urlValidation} from "../middlewares/blog-validation-mw";
import {authorizationCheck} from "../middlewares/authorization-mw";
import {inputValidationMw} from "../middlewares/inputErrorsCheck-mw";

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