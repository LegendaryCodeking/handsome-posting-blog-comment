import request from 'supertest'

import {STATUSES_HTTP} from "../../enum/http-statuses";
import {BlogCreateModel} from "../../models/BLogs/BlogModel";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {blogsTestManager} from "../utils/blogsTestManager";
import {authBasicHeader, connection_string} from "../utils/export_data_functions";
import {PostViewModel} from "../../models/Posts/PostViewModel";
import {PostCreateModel} from "../../models/Posts/PostCreateModel";
import {postsTestManager} from "../utils/postsTestManager";
import {UserCreateModel, UserViewModel} from "../../models/Users/UserModel";
import {usersTestManager} from "../utils/usersTestManager";
import {BlogViewModel} from "../../models/BLogs/BlogViewModel";
import {CommentViewModel, CreateCommentModel} from "../../models/Comments/CommentModel";
import {commentTestManager} from "../utils/commentTestManager";
import {jwtService} from "../../application/jwt-service";
import mongoose from "mongoose";
import {likeStatus} from "../../enum/likeStatuses";

jest.setTimeout(10000)

describe('/Testing likes', () => {
    let post: PostViewModel;
    let user1: UserViewModel;
    let user2: UserViewModel;
    let blog: BlogViewModel;
    let authJWTHeader1: {};
    let authJWTHeader2: {};
    beforeAll(async () => {
        await mongoose.connect(connection_string);

        await request(app).delete(`${RouterPaths.testing}/all-data`)

        // Создаем блог, к которому будем прикреплять пост
        const dataBlog: BlogCreateModel = {
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman",
            "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
        }

        const {createdBlog} = await blogsTestManager.createBlog(dataBlog, STATUSES_HTTP.CREATED_201, authBasicHeader)
        blog = createdBlog

        // Создаем пост, к которому будем прикреплять комменты
        const dataPost: PostCreateModel = {
            "title": "amazing Math_1",
            "shortDescription": "Short description about new amazing Math_1 course",
            "content": "Math_1 Math_1 Math_1 Math_1 Math_1 Math_1",
            "blogId": createdBlog.id,
        }

        const {createdPost} = await postsTestManager.createPost(dataPost, STATUSES_HTTP.CREATED_201, authBasicHeader)
        post = createdPost

        //Создаем юзера1, чтобы оставлять комменты

        const dataUser: UserCreateModel = {
            "login": "User01",
            "password": "Password01",
            "email": "email01@fishmail2dd.com",
        }

        const {createdUser: createdUser1} = await usersTestManager.createUser(dataUser, STATUSES_HTTP.CREATED_201, authBasicHeader)
        user1 = createdUser1

        const AccessToken1 = await jwtService.createJWT(user1)
        authJWTHeader1 = {Authorization: `Bearer ${AccessToken1}`}

        //Создаем юзера2, чтобы оставлять комменты

        const dataUser2: UserCreateModel = {
            "login": "User02",
            "password": "Password02",
            "email": "email02@fishmail3dd.com",
        }

        const {createdUser: createdUser2} = await usersTestManager.createUser(dataUser2, STATUSES_HTTP.CREATED_201, authBasicHeader)
        user2 = createdUser2

        const AccessToken2 = await jwtService.createJWT(user2)
        authJWTHeader2 = {Authorization: `Bearer ${AccessToken2}`}

    })

    it('Check that necessary support objects have been successfully created', async () => {
        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user1).not.toBeNull();
    })


    // Создаем первый коммент от первого юзера

    let comment_1: CommentViewModel = {
        id: "",
        content: "",
        commentatorInfo: {
            userId: "",
            userLogin: ""
        },
        createdAt: "",
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: likeStatus.None
        }
    }

    it('should create comment 1', async () => {

        const data: CreateCommentModel = {
            content: "I just called to say I love you"
        }

        const {createdComment} = await commentTestManager.createComment(post.id, data, STATUSES_HTTP.CREATED_201, authJWTHeader1)

        comment_1 = createdComment

        await request(app)
            .get(`${RouterPaths.posts}/${post.id}/comments`)
            .expect(STATUSES_HTTP.OK_200, {
                pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{
                    id: comment_1.id,
                    content: data.content,
                    commentatorInfo: comment_1.commentatorInfo,
                    createdAt: comment_1.createdAt,
                    likesInfo: comment_1.likesInfo

                }]
            })
    })


    // Создаем второй коммент от первого юзера

    let comment_2: CommentViewModel = {
        id: "",
        content: "",
        commentatorInfo: {
            userId: "",
            userLogin: ""
        },
        createdAt: "",
        likesInfo: {
            likesCount: 0,
            dislikesCount: 0,
            myStatus: likeStatus.None
        }
    }

    it('should create comment 2', async () => {

        const data: CreateCommentModel = {
            content: "I just called to say I love you 2"
        }

        const {createdComment} = await commentTestManager.createComment(post.id, data, STATUSES_HTTP.CREATED_201, authJWTHeader2)

        comment_2 = createdComment

        await request(app)
            .get(`${RouterPaths.posts}/${post.id}/comments`)
            .expect(STATUSES_HTTP.OK_200, {
                pagesCount: 1, page: 1, pageSize: 10, totalCount: 2, items: [
                    {
                        id: comment_2.id,
                        content: data.content,
                        commentatorInfo: comment_2.commentatorInfo,
                        createdAt: comment_2.createdAt,
                        likesInfo: comment_2.likesInfo
                    }, {
                        id: comment_1.id,
                        content: comment_1.content,
                        commentatorInfo: comment_1.commentatorInfo,
                        createdAt: comment_1.createdAt,
                        likesInfo: comment_1.likesInfo
                    }]
            })
    })


    afterAll(async () => {
        await mongoose.disconnect()
    })
})

