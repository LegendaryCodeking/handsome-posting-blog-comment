import request from 'supertest'

import {STATUSES_HTTP} from "../../enum/http-statuses";
import {BlogCreateModel, BlogViewModel} from "../../models/BLogs/BlogModel";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {blogsTestManager} from "../utils/blogsTestManager";
import {authBasicHeader, connection_string, generateString} from "../utils/export_data_functions";
import {PostViewModel,PostCreateModel} from "../../models/Posts/PostModel";
import {postsTestManager} from "../utils/postsTestManager";
import {UserCreateModel, UserViewModel} from "../../models/Users/UserModel";
import {usersTestManager} from "../utils/usersTestManager";
import {CommentViewModel, CreateCommentModel, UpdateCommentModel} from "../../models/Comments/CommentModel";
import {commentTestManager} from "../utils/commentTestManager";
import {jwtService} from "../../application/jwt-service";
import mongoose from "mongoose";
import {likeStatus} from "../../enum/likeStatuses";

jest.setTimeout(10000)

describe('/Testing comments', () => {
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


    it('should return 404 for not existing comment', async () => {
        await request(app)
            .get(`${RouterPaths.comments}/-22222222220`)
            .expect(STATUSES_HTTP.NOT_FOUND_404)
    })

    it('should return 404 and empty array', async () => {
        await request(app)
            .get(`${RouterPaths.posts}/${post.id}/comments`)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    it('should not create comment without AUTH', async () => {

        const data: CreateCommentModel = {
            content: "Absolutely new comment"
        }

        await commentTestManager.createComment(post.id, data, STATUSES_HTTP.UNAUTHORIZED_401)


        await request(app)
            .get(`${RouterPaths.posts}/${post.id}/comments`)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })


    it('should not create comment without content', async () => {

        const data: CreateCommentModel = {
            content: ""
        }

        await commentTestManager.createComment(post.id, data, STATUSES_HTTP.BAD_REQUEST_400, authJWTHeader1)

        await request(app)
            .get(`${RouterPaths.posts}/${post.id}/comments`)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
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

    it('should not update comment 1 without AUTH', async () => {

        const data: UpdateCommentModel = {
            content: "NEW OUTSTANDING UPDATED COMMENT 1"
        }

        const response = await request(app)
            .put(`${RouterPaths.comments}/${comment_1.id}`)
            .send(data)
            .expect(STATUSES_HTTP.UNAUTHORIZED_401)

        await request(app)
            .get(`${RouterPaths.comments}/${comment_1.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                id: comment_1.id,
                content: comment_1.content,
                commentatorInfo: comment_1.commentatorInfo,
                createdAt: comment_1.createdAt,
                likesInfo: comment_1.likesInfo
            })
    })

    it('should not update comment 1 with AUTH but incorrect body', async () => {

        const data1: UpdateCommentModel = {
            content: "UPDATED COMMENT 1"
        }

        const response1 = await request(app)
            .put(`${RouterPaths.comments}/${comment_1.id}`)
            .set(authJWTHeader1)
            .send(data1)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)

        const response2 = await request(app)
            .put(`${RouterPaths.comments}/${comment_1.id}`)
            .set(authJWTHeader1)
            .send({
                content: generateString(401)
            })
            .expect(STATUSES_HTTP.BAD_REQUEST_400)

        await request(app)
            .get(`${RouterPaths.comments}/${comment_1.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                id: comment_1.id,
                content: comment_1.content,
                commentatorInfo: comment_1.commentatorInfo,
                createdAt: comment_1.createdAt,
                likesInfo: comment_1.likesInfo
            })
    })

    it('should not update comment 2 with AUTH of another user (403)', async () => {

        const data: UpdateCommentModel = {
            content: "NEW OUTSTANDING UPDATED COMMENT 1"
        }

        const response = await request(app)
            .put(`${RouterPaths.comments}/${comment_1.id}`)
            .set(authJWTHeader2)
            .send(data)
            .expect(STATUSES_HTTP.FORBIDDEN_403)

        await request(app)
            .get(`${RouterPaths.comments}/${comment_1.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                id: comment_1.id,
                content: comment_1.content,
                commentatorInfo: comment_1.commentatorInfo,
                createdAt: comment_1.createdAt,
                likesInfo: comment_1.likesInfo
            })
    })

    it('should update comment 1 with correct AUTH', async () => {

        const data: UpdateCommentModel = {
            content: "NEW OUTSTANDING UPDATED COMMENT 1"
        }

        const response = await request(app)
            .put(`${RouterPaths.comments}/${comment_1.id}`)
            .set(authJWTHeader1)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.comments}/${comment_1.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                id: comment_1.id,
                content: data.content,
                commentatorInfo: comment_1.commentatorInfo,
                createdAt: comment_1.createdAt,
                likesInfo: comment_1.likesInfo
            })
        comment_1.content = data.content
    })

    it('"DELETE/PUT should return 404 if :id from uri param not found', async () => {

        const data: UpdateCommentModel = {
            content: "NEW OUTSTANDING UPDATED COMMENT 222"
        }

        const response1 = await request(app)
            .put(`${RouterPaths.comments}/-223232323`)
            .set(authJWTHeader1)
            .send(data)
            .expect(STATUSES_HTTP.NOT_FOUND_404)

        const response2 = await request(app)
            .delete(`${RouterPaths.comments}/-223232323`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.NOT_FOUND_404)

        await request(app)
            .get(`${RouterPaths.comments}/${comment_1.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                id: comment_1.id,
                content: comment_1.content,
                commentatorInfo: comment_1.commentatorInfo,
                createdAt: comment_1.createdAt,
                likesInfo: comment_1.likesInfo
            })
    })

    it('should not delete comment_1 with AUTH of another user (403)', async () => {

        const response = await request(app)
            .delete(`${RouterPaths.comments}/${comment_1.id}`)
            .set(authJWTHeader2)
            .expect(STATUSES_HTTP.FORBIDDEN_403)

        await request(app)
            .get(`${RouterPaths.comments}/${comment_1.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                id: comment_1.id,
                content: comment_1.content,
                commentatorInfo: comment_1.commentatorInfo,
                createdAt: comment_1.createdAt,
                likesInfo: comment_1.likesInfo
            })
    })

    it('should delete comment 1 with correct AUTH and path', async () => {

        const response = await request(app)
            .delete(`${RouterPaths.comments}/${comment_1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        await request(app)
            .get(`${RouterPaths.comments}/${comment_1.id}`)
            .expect(STATUSES_HTTP.NOT_FOUND_404)

        await request(app)
            .get(`${RouterPaths.posts}/${post.id}/comments`)
            .expect(STATUSES_HTTP.OK_200, {
                pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{
                    id: comment_2.id,
                    content: comment_2.content,
                    commentatorInfo: comment_2.commentatorInfo,
                    createdAt: comment_2.createdAt,
                    likesInfo: comment_2.likesInfo
                }]
            })
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })
})

