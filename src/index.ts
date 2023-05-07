import express from 'express'
import {blogsRouter, db_blogs} from "./routes/blogs-router";

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



export const STATUSES_HTTP = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404
}

app.use('/blogs', blogsRouter)

app.delete('/testing/all-data', (req, res) => {
    db_blogs.blogs = [];
    res.sendStatus(STATUSES_HTTP.NO_CONTENT_204)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})