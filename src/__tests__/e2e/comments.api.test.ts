import request from 'supertest'

import {STATUSES_HTTP} from "../../enum/http-statuses";
import {BlogCreateModel} from "../../models/BLogs/BlogModel";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {blogsTestManager} from "../utils/blogsTestManager";
import {authBasicHeader} from "../utils/const_data";
import {PostViewModel} from "../../models/Posts/PostViewModel";
import {PostCreateModel} from "../../models/Posts/PostCreateModel";
import {postsTestManager} from "../utils/postsTestManager";
import {UserCreateModel, UserViewModel} from "../../models/Users/UserModel";
import {usersTestManager} from "../utils/usersTestManager";
import {BlogViewModel} from "../../models/BLogs/BlogViewModel";
import {CreateCommentModel} from "../../models/Comments/CommentModel";
import {commentTestManager} from "../utils/commentTestManager";
import {jwtService} from "../../application/jwt-service";

describe('/Testing comments', () => {
    let post: PostViewModel;
    let user: UserViewModel;
    let blog: BlogViewModel;
    let authJWTHeader: {};
    beforeAll(async () => {
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

        const {createdUser} = await usersTestManager.createUser(dataUser, STATUSES_HTTP.CREATED_201, authBasicHeader)
        user = createdUser

        const AccessToken = await jwtService.createJWT(user)
        authJWTHeader = {Authorization: `Bearer ${AccessToken}`}

    })

    it('Check that necessary support objects have been successfully created', async () => {
        expect(blog).not.toBeNull();
        expect(post).not.toBeNull();
        expect(user).not.toBeNull();
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

        await commentTestManager.createComment(post.id, data, STATUSES_HTTP.BAD_REQUEST_400, authJWTHeader)

        await request(app)
            .get(`${RouterPaths.posts}/${post.id}/comments`)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

})