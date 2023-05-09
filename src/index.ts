import express from 'express'
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {testingRouter} from "./routes/testing-router";

const app = express()
const port = 7050

const jsonBodyMW = express.json()
app.use(jsonBodyMW)

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing', testingRouter)

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})