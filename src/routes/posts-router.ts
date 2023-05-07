import {NextFunction, Request, Response, Router} from 'express'
import {body, validationResult} from "express-validator";
import {STATUSES_HTTP} from "../index";

export let db_posts = {
    posts: [
        {
            "id": "1",
            "title": "Very interesting story number 111111111",
            "shortDescription": "Very interesting story number 111111111 short desc",
            "content": "Very interesting story number 111111111 outstanding content",
            "blogId": "111111111",
            "blogName": "BingoBlog"
        },
        {
            "id": "2",
            "title": "Very interesting story number 222222",
            "shortDescription": "Very interesting story number 222222 short desc",
            "content": "Very interesting story number 222222 outstanding content",
            "blogId": "222222",
            "blogName": "ShlakoBlocun"
        },
        {
            "id": "3",
            "title": "Very interesting story number 3333333333",
            "shortDescription": "Very interesting story number 3333333333 short desc",
            "content": "Very interesting story number 3333333333 outstanding content",
            "blogId": "3333333333",
            "blogName": "DogMemes"
        }

    ]
}

const titleValidation = body("title").isString().trim().isLength({min: 1, max: 15}).withMessage("Title should be string with length from 1 to 15 symbols")
const shortDescription = body("title").isString().trim().isLength({min: 1, max: 100}).withMessage("shortDescription should be string with length from 1 to 15 symbols")
const content = body("title").isString().trim().isLength({min: 1, max: 1000}).withMessage("Title should be string with length from 1 to 15 symbols")
const blogId = body("title").isString().trim().isLength({min: 1}).withMessage("Title should be string with length from 1 to 15 symbols")
const inputValidationMw = (req: Request, res: Response, next: NextFunction) => {
    const result = validationResult(req);
    if (!result.isEmpty()) {
        //@ts-ignore
        res.send({errors: result.array().map(val => ({"message": val.msg, "type": val["path"]}))});
    } else {
        next();
    }
}


export const postsRouter = Router({})

postsRouter.get('/', (req, res) => {
    let foundPosts = db_posts.posts

    if (!foundPosts.length) {
        res.status(STATUSES_HTTP.NOT_FOUND_404)
            .json(foundPosts);
        return;
    }
    res.status(STATUSES_HTTP.OK_200)
        .json(foundPosts)
})

postsRouter.get('/:id', (req, res) => {
    const foundPost = db_posts.posts.find(c => +c.id === +req.params.id)

    if (!foundPost) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    res.json(foundPost)
})

postsRouter.delete('/:id', (req, res) => {
    const foundPost = db_posts.posts.find(c => +c.id === +req.params.id)

    if (!foundPost) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    db_posts.posts = db_posts.posts.filter(c => +c.id !== +req.params.id)

    res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})

postsRouter.post('/',
    (req, res) => {

        const createdPost = {
            "id": (+(new Date())).toString(),
            "title": req.body.title,
            "shortDescription": req.body.shortDescription,
            "content": req.body.content,
            "blogId": req.body.blogId,
            "blogName": "BlogName"
        }

        db_posts.posts.push(createdPost)

        res.status(STATUSES_HTTP.CREATED_201)
            .json(createdPost)
    })

postsRouter.put('/:id',
    (req, res) => {

        const foundPost = db_posts.posts.find(c => +c.id === +req.params.id);

        if (!foundPost) {
            res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
            return;
        }

        foundPost.title = req.body.title;
        foundPost.shortDescription = req.body.shortDescription;
        foundPost.content = req.body.content;
        foundPost.blogId = req.body.blogId;

        res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
    }
)