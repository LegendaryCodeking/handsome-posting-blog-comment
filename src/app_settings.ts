import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {testingRouter} from "./routes/testing-router";
import {commentsRouter} from "./routes/comments-router";
import express from "express";
import cookieParser from 'cookie-parser'
import {securityRouter} from "./routes/security-router";


export const app = express()

const jsonBodyMW = express.json()
app.use(jsonBodyMW)
app.use(cookieParser())

app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/security/devices', securityRouter)
app.use('/testing', testingRouter)
app.use('/comments', commentsRouter)