import {NextFunction, Request, Response, Router} from 'express'
import {body, validationResult} from "express-validator";
import {STATUSES_HTTP} from "../index";

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
            //@ts-ignore
            .json({errors: result.array().map(val => ({"message": val.msg, "field": val["path"]}))});
    } else {
        next();
    }
}

export let db_blogs = {
    blogs: [
        {
            "id": "1",
            "name": "Marieh Kondo",
            "description": "Bingo article about Marieh Kondo and his famous book",
            "websiteUrl": "https://telegra.ph/Marieh-Kondo-02-14"
        },
        {
            "id": "2",
            "name": "Meandr",
            "description": "Bingo article about Meandr",
            "websiteUrl": "https://telegra.ph/Meandr-02-14"
        },
        {
            "id": "3",
            "name": "Dzhiro dItaliya",
            "description": "Bingo article about famous italian bicycle race Dzhiro dItaliya",
            "websiteUrl": "https://telegra.ph/Dzhiro-dItaliya-02-13"
        }

    ]
}

export const blogsRouter = Router({})

blogsRouter.get('/', (req: Request, res: Response) => {
    let foundBlogs = db_blogs.blogs

    if (!foundBlogs.length) {
        res.status(STATUSES_HTTP.NOT_FOUND_404)
            .json(foundBlogs);
        return;
    }
    res.status(STATUSES_HTTP.OK_200)
        .json(foundBlogs)
})

blogsRouter.get('/:id', (req: Request, res: Response) => {
    const foundBlog = db_blogs.blogs.find(c => +c.id === +req.params.id)

    if (!foundBlog) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    res.json(foundBlog)
})

blogsRouter.delete('/:id', authorizationCheck,  (req: Request, res: Response) => {
    const foundBlog = db_blogs.blogs.find(c => +c.id === +req.params.id)

    if (!foundBlog) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    db_blogs.blogs = db_blogs.blogs.filter(c => +c.id !== +req.params.id)

    res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})


blogsRouter.post('/',
    authorizationCheck,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    (req: Request, res: Response) => {

        const createdPost = {
            "id": (+(new Date())).toString(),
            "name": req.body.name,
            "description": req.body.description,
            "websiteUrl": req.body.websiteUrl
        }

        db_blogs.blogs.push(createdPost)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdPost)
    })


blogsRouter.put('/:id',
    authorizationCheck,
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    (req: Request, res: Response) => {

        const foundBlog = db_blogs.blogs.find(c => +c.id === +req.params.id);

        if (!foundBlog) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        foundBlog.name = req.body.name;
        foundBlog.description = req.body.description;
        foundBlog.websiteUrl = req.body.websiteUrl;

        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    }
)