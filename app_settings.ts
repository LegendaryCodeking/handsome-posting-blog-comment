import {blogsRouter} from "./src/routes/blogs-router";
import {postsRouter} from "./src/routes/posts-router";
import {usersRouter} from "./src/routes/users-router";
import {authRouter} from "./src/routes/auth-router";
import {testingRouter} from "./src/routes/testing-router";
import {commentsRouter} from "./src/routes/comments-router";
import express from "express";


export const app = express()

const jsonBodyMW = express.json()
app.use(jsonBodyMW)

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/testing', testingRouter)
app.use('/comments', commentsRouter)