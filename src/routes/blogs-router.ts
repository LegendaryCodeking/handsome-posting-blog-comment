import {NextFunction, Request, Response, Router} from 'express'
import {STATUSES_HTTP} from "../index";
import {body, validationResult} from "express-validator";

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
        //@ts-ignore
        res.send({errors: result.array().map(val => ({"message": val.msg, "type": val["path"]}))});
    } else {
        next();
    }
}

export let db_blogs = {
    blogs: [
        {
            "id": 1,
            "name": "Marieh Kondo",
            "description": "Bingo article about Marieh Kondo and his famous book",
            "websiteUrl": "https://telegra.ph/Marieh-Kondo-02-14"
        },
        {
            "id": 2,
            "name": "Meandr",
            "description": "Bingo article about Meandr",
            "websiteUrl": "https://telegra.ph/Meandr-02-14"
        },
        {
            "id": 3,
            "name": "Dzhiro dItaliya",
            "description": "Bingo article about famous italian bicycle race Dzhiro dItaliya",
            "websiteUrl": "https://telegra.ph/Dzhiro-dItaliya-02-13"
        }

    ]
}

export const blogsRouter = Router({})

blogsRouter.get('/blogs', (req, res) => {
    let foundBlogs = db_blogs.blogs

    if (!foundBlogs.length) {
        res.status(STATUSES_HTTP.NOT_FOUND_404)
            .json(foundBlogs);
        return;
    }
    res.status(STATUSES_HTTP.OK_200)
        .json(foundBlogs)
})

blogsRouter.get('/blogs/:id', (req, res) => {
    const foundBlog = db_blogs.blogs.find(c => c.id === +req.params.id)

    if (!foundBlog) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    res.json(foundBlog)
})

blogsRouter.delete('/blogs/:id', (req, res) => {
    const foundBlog = db_blogs.blogs.find(c => c.id === +req.params.id)

    if (!foundBlog) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    db_blogs.blogs = db_blogs.blogs.filter(c => c.id !== +req.params.id)

    res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})


blogsRouter.post('/blogs',
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    (req, res) => {

        const createdPost = {
            "id": +(new Date()),
            "name": req.body.name,
            "description": req.body.description,
            "websiteUrl": req.body.websiteUrl
        }

        db_blogs.blogs.push(createdPost)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdPost)
    })


blogsRouter.put('/blogs/:id',
    nameValidation,
    descriptionValidation,
    urlValidation,
    inputValidationMw,
    (req, res) => {

        const foundBlog = db_blogs.blogs.find(c => c.id === +req.params.id);

        if (!foundBlog) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        foundBlog.name = req.body.title;
        foundBlog.description = req.body.author;
        foundBlog.websiteUrl = req.body.availableResolutions;

        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    }
)