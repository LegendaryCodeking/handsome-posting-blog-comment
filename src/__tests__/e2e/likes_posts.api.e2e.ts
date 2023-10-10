import request from 'supertest'

import {STATUSES_HTTP} from "../../enum/http-statuses";
import {BlogCreateModel, BlogViewModel} from "../../models/BLogs/BlogModel";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {blogsTestManager} from "../utils/blogsTestManager";
import {authBasicHeader, connection_string} from "../utils/export_data_functions";
import {PostCreateModel, PostViewModel} from "../../models/Posts/PostModel";
import {postsTestManager} from "../utils/postsTestManager";
import {UserCreateModel, UserViewModel} from "../../models/Users/UserModel";
import {usersTestManager} from "../utils/usersTestManager";
import {jwtService} from "../../application/jwt-service";
import mongoose from "mongoose";
import {likeStatus} from "../../enum/likeStatuses";
import {likeInputModel} from "../../models/Comments/LikeModel";

jest.setTimeout(100000)

describe('/Testing likes', () => {
    let post1: PostViewModel;
    let post2: PostViewModel;
    let user1: UserViewModel;
    let user2: UserViewModel;
    let user3: UserViewModel;
    let blog: BlogViewModel;
    let authJWTHeader1: {};
    let authJWTHeader2: {};
    let authJWTHeader3: {};
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

        // Создаем пост1, к которому будем прикреплять комменты
        const dataPost1: PostCreateModel = {
            "title": "amazing Math_1",
            "shortDescription": "Short description about new amazing Math_1 course",
            "content": "Math_1 Math_1 Math_1 Math_1 Math_1 Math_1",
            "blogId": createdBlog.id,
        }

        const {createdPost: createdPost1 } = await postsTestManager.createPost(dataPost1, STATUSES_HTTP.CREATED_201, authBasicHeader)
        post1 = createdPost1

        // Создаем пост2, к которому будем прикреплять комменты
        const dataPost2: PostCreateModel = {
            "title": "amazing post_2",
            "shortDescription": "Short description post_2",
            "content": "post_2 post_2 post_2",
            "blogId": createdBlog.id,
        }

        const {createdPost: createdPost2} = await postsTestManager.createPost(dataPost1, STATUSES_HTTP.CREATED_201, authBasicHeader)
        post2 = createdPost2

        //Создаем юзера1, чтобы оставлять  лайки

        const dataUser: UserCreateModel = {
            "login": "User01",
            "password": "Password01",
            "email": "email01@fishmail2dd.com",
        }

        const {createdUser: createdUser1} = await usersTestManager.createUser(dataUser, STATUSES_HTTP.CREATED_201, authBasicHeader)
        user1 = createdUser1

        const AccessToken1 = await jwtService.createJWT(user1)
        authJWTHeader1 = {Authorization: `Bearer ${AccessToken1}`}

        //Создаем юзера2, чтобы оставлять  лайки

        const dataUser2: UserCreateModel = {
            "login": "User02",
            "password": "Password02",
            "email": "email02@fishmail3dd.com",
        }

        const {createdUser: createdUser2} = await usersTestManager.createUser(dataUser2, STATUSES_HTTP.CREATED_201, authBasicHeader)
        user2 = createdUser2

        const AccessToken2 = await jwtService.createJWT(user2)
        authJWTHeader2 = {Authorization: `Bearer ${AccessToken2}`}

        //Создаем юзера3, чтобы оставлять комменты и лайки

        const dataUser3: UserCreateModel = {
            "login": "User02",
            "password": "Password02",
            "email": "email02@fishmail3dd.com",
        }

        const {createdUser: createdUser3} = await usersTestManager.createUser(dataUser3, STATUSES_HTTP.CREATED_201, authBasicHeader)
        user3 = createdUser3

        const AccessToken3 = await jwtService.createJWT(user3)
        authJWTHeader3 = {Authorization: `Bearer ${AccessToken3}`}

    })

    it('Check that necessary support objects have been successfully created', async () => {
        expect(blog).not.toBeNull();
        expect(post1).not.toBeNull();
        expect(post2).not.toBeNull();
        expect(user1).not.toBeNull();
        expect(user2).not.toBeNull();
        expect(user3).not.toBeNull();
    })


    it('Like without auth should return 401 ERROR', async () => {

        const data: likeInputModel = {
            likeStatus: likeStatus.Like
        }

        const response = await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .send(data)
            .expect(STATUSES_HTTP.UNAUTHORIZED_401)

    })

    it('Like for incorrect commentID should return 404 ERROR', async () => {

        const data: likeInputModel = {
            likeStatus: likeStatus.Like
        }

        const response = await request(app)
            .put(`${RouterPaths.posts}/-22222222222/like-status`)
            .set(authJWTHeader1)
            .send(data)
            .expect(STATUSES_HTTP.NOT_FOUND_404)

    })

    it('Incorrect input data. 400 Error', async () => {

        const data = {
            likeStatus: "Super"
        }

        const response = await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(data)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)

    })



    it('Successful like with AUTH', async () => {

        const data: likeInputModel = {
            likeStatus: likeStatus.Like
        }

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })


    })

    it('GET COMMENT without AUTH. Status None', async () => {

        let response = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .expect(STATUSES_HTTP.OK_200)

        expect(response.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

    })

    it('Like User1 + Dislike user2', async () => {

        const dataLike: likeInputModel = {
            likeStatus: likeStatus.Like
        }

        const dataDislike: likeInputModel = {
            likeStatus: likeStatus.Dislike
        }

        const dataReset: likeInputModel = {
            likeStatus: likeStatus.None
        }

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response1 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response1.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader2)
            .send(dataDislike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response2 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader2)
            .expect(STATUSES_HTTP.OK_200)

        expect(response2.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 1,
            "myStatus": likeStatus.Dislike,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        let response3 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response3.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 1,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader2)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response4 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response4.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": []
        })


    })


    it('Like/Dislike/Reset by one user', async () => {


        const dataLike: likeInputModel = {
            likeStatus: likeStatus.Like
        }

        const dataDisLike: likeInputModel = {
            likeStatus: likeStatus.Dislike
        }

        const dataReset: likeInputModel = {
            likeStatus: likeStatus.None
        }

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": []
        })

        //////////////////
        // Like + dislike
        //////////////////
        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response1_1 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response1_1.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataDisLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response1_2 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response1_2.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 1,
            "myStatus": likeStatus.Dislike,
            "newestLikes": [
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response1_3 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)


        expect(response1_3.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": []
        })

        //////////////////
        // Dislike + like
        //////////////////
        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataDisLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response2_1 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response2_1.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 1,
            "myStatus": likeStatus.Dislike,
            "newestLikes": [
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response2_2 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response2_2.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response2_3 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response2_3.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": []
        })

        //////////////////
        // Dislike + reset + like
        //////////////////
        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataDisLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response3_1 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response3_1.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 1,
            "myStatus": likeStatus.Dislike,
            "newestLikes": [
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response3_2 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response3_2.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": []
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response3_3 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response3_3.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response3_4 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response3_4.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": []
        })

        //////////////////
        // Like + reset + dislike
        //////////////////
        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response4_1 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response4_1.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response4_2 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response4_2.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": []
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataDisLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response4_3 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response4_3.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 1,
            "myStatus": likeStatus.Dislike,
            "newestLikes": []
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response4_4 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response4_4.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": []
        })

        //////////////////
        // Like + reset + Like
        //////////////////
        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response5_1 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response5_1.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response5_2 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response5_2.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": []
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response5_3 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response5_3.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response5_4 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)


        expect(response5_4.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": []
        })


        //////////////////
        // Like + Like
        //////////////////
        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response6_1 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response6_1.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response6_2 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response6_2.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        //////////////////
        // DisLike + DisLike
        //////////////////
        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataDisLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response7_1 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response7_1.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 1,
            "myStatus": likeStatus.Dislike,
            "newestLikes": []
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataDisLike)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response7_2 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response7_2.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 1,
            "myStatus": likeStatus.Dislike,
            "newestLikes": []
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(dataReset)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response7_3 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response7_3.body.extendedLikesInfo).toEqual({
            "likesCount": 0,
            "dislikesCount": 0,
            "myStatus": likeStatus.None,
            "newestLikes": []
        })

    })

    it('LIKES by different users', async () => {

        const data: likeInputModel = {
            likeStatus: likeStatus.Like
        }
        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader1)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response.body.extendedLikesInfo).toEqual({
            "likesCount": 1,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })


        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader2)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response2 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response2.body.extendedLikesInfo).toEqual({
            "likesCount": 2,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user2.id,
                    login: user2.login
                },
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

        await request(app)
            .put(`${RouterPaths.posts}/${post1.id}/like-status`)
            .set(authJWTHeader3)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        let response3 = await request(app)
            .get(`${RouterPaths.posts}/${post1.id}`)
            .set(authJWTHeader1)
            .expect(STATUSES_HTTP.OK_200)

        expect(response3.body.extendedLikesInfo).toEqual({
            "likesCount": 3,
            "dislikesCount": 0,
            "myStatus": likeStatus.Like,
            "newestLikes": [
                {
                    addedAt: expect.any(String),
                    userId: user3.id,
                    login: user3.login
                },
                {
                    addedAt: expect.any(String),
                    userId: user2.id,
                    login: user2.login
                },
                {
                    addedAt: expect.any(String),
                    userId: user1.id,
                    login: user1.login
                }
            ]
        })

    })


    afterAll(async () => {
        await mongoose.disconnect()
    })
})

