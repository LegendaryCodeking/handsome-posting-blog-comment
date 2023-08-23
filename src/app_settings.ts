import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {usersRouter} from "./routes/users-router";
import {authRouter} from "./routes/auth-router";
import {testingRouter} from "./routes/testing-router";
import {commentsRouter} from "./routes/comments-router";
import express from "express";
import cookieParser from 'cookie-parser'
import {securityRouter} from "./routes/security-router";
import {RouterPaths} from "./helpers/RouterPaths";


export const app = express()

const jsonBodyMW = express.json()
app.use(jsonBodyMW)
app.use(cookieParser())

app.use(RouterPaths.blogs, blogsRouter)
app.use(RouterPaths.posts, postsRouter)
app.use(RouterPaths.comments, commentsRouter)
app.use(RouterPaths.users, usersRouter)
app.use(RouterPaths.auth, authRouter)
app.use(RouterPaths.securityDevices, securityRouter)
app.use(RouterPaths.testing, testingRouter)