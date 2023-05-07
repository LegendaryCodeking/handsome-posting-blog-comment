import express, {NextFunction, Request, Response} from 'express'
import {body, validationResult} from 'express-validator';

const app = express()
const port = 7050

const jsonBodyMW = express.json()
app.use(jsonBodyMW)

// const isItNotString = (value: any) => {
//     return typeof value !== 'string'
// }
//
// const notCorrectResolutions = (arr: Array<string>) => {
//     let correctResolutions = ['P144', 'P240', 'P360', 'P480', 'P720', 'P1080', 'P1440', 'P2160']
//     return arr.reduce(function (answer, item) {
//         return correctResolutions.indexOf(item) === -1 ? answer + 1 : answer
//     }, 0)
//
// }
// const isNotDate = (date: string) => {
//     return (String(new Date(date)) === "Invalid Date") || isNaN(+(new Date(date)));
// }

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

let db_blogs = {
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

export const STATUSES_HTTP = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

app.get('/blogs', (req, res) => {
    let foundBlogs = db_blogs.blogs

    if (!foundBlogs.length) {
        res.status(STATUSES_HTTP.NOT_FOUND_404)
            .json(foundBlogs);
        return;
    }
    res.status(STATUSES_HTTP.OK_200)
        .json(foundBlogs)
})

app.get('/blogs/:id', (req, res) => {
    const foundBlog = db_blogs.blogs.find(c => c.id === +req.params.id)

    if (!foundBlog) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    res.json(foundBlog)
})

app.delete('/blogs/:id', (req, res) => {
    const foundBlog = db_blogs.blogs.find(c => c.id === +req.params.id)

    if (!foundBlog) {
        res.sendStatus(STATUSES_HTTP.NOT_FOUND_404)
        return;
    }

    db_blogs.blogs = db_blogs.blogs.filter(c => c.id !== +req.params.id)

    res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})


app.post('/blogs',
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


app.put('/blogs/:id',
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


app.delete('/testing/all-data', (req, res) => {
    db_blogs.blogs = [];
    res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})