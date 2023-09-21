import request from 'supertest'

import {STATUSES_HTTP} from "../../enum/http-statuses";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {postsTestManager} from "../utils/postsTestManager";
import {PostCreateModel} from "../../models/Posts/PostCreateModel";
import {PostDBModel} from "../../models/Posts/PostDBModel";
import {PostUpdateModel} from "../../models/Posts/PostUpdateModel";
import {BlogCreateModel} from "../../models/BLogs/BlogModel";
import {blogsTestManager} from "../utils/blogsTestManager";
import {authBasicHeader, connection_string} from "../utils/export_data_functions";
import {BlogViewModel} from "../../models/BLogs/BlogViewModel";
import mongoose from "mongoose";

describe('/Testing posts', () => {
    let blog: BlogViewModel;
    beforeAll(async () => {
        // Создаем блог, к которому будем прикреплять посты
        const data: BlogCreateModel = {
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman",
            "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
        }

        const {createdBlog} = await blogsTestManager.createBlog(data, STATUSES_HTTP.CREATED_201, authBasicHeader)
        blog = createdBlog

        await mongoose.connect(connection_string);
    })

    it('Delete all data before tests', async () => {

        await request(app)
            .delete(`${RouterPaths.testing}/all-data`)
            .expect(STATUSES_HTTP.NO_CONTENT_204)
    })




    it('should return 404 and empty array', async () => {
        await request(app)
            .get(RouterPaths.posts)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    it('should return 404 for not existing post', async () => {
        await request(app)
            .get(`${RouterPaths.posts}/-22222222220`)
            .expect(STATUSES_HTTP.NOT_FOUND_404)
    })

    it('should not create POST without AUTH', async () => {

        const data: PostCreateModel = {
            "title": "amazing Math_1",
            "shortDescription": "Short description about new amazing Math_1 course",
            "content": "Math_1 Math_1 Math_1 Math_1 Math_1 Math_1",
            "blogId": blog.id,
        }

        await postsTestManager.createPost(data, STATUSES_HTTP.UNAUTHORIZED_401)

        await request(app)
            .get(RouterPaths.posts)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    /*
    * Created variable outside the next test to have option use
    * id of created post in the further put test
    * */
    let createdPost1: PostDBModel = {
        "id": "",
        "title": "",
        "shortDescription": "shortDescription",
        "content": "",
        "blogId": "",
        "blogName": "",
        "createdAt": "",
        "comments": []
    };

    it('should not create post with AUTH and correct input data but non existed blogID', async () => {

        const data: PostCreateModel = {
            "title": "amazing Math_1",
            "shortDescription": "Short description about new amazing Math_1 course",
            "content": "Math_1 Math_1 Math_1 Math_1 Math_1 Math_1",
            "blogId": "-222222",
        }

        await postsTestManager.createPost(data, STATUSES_HTTP.BAD_REQUEST_400, authBasicHeader)


        await request(app)
            .get(RouterPaths.posts)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {
                pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []
            })
    })

    it('should create post with AUTH and correct input data', async () => {

        const data: PostCreateModel = {
            "title": "amazing Math_1",
            "shortDescription": "Short description about new amazing Math_1 course",
            "content": "Math_1 Math_1 Math_1 Math_1 Math_1 Math_1",
            "blogId": blog.id,
        }

        const {createdPost} = await postsTestManager.createPost(data, STATUSES_HTTP.CREATED_201, authBasicHeader)

        createdPost1 = createdPost!

        await request(app)
            .get(RouterPaths.posts)
            .expect(STATUSES_HTTP.OK_200, {
                pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{
                    "id": createdPost1.id,
                    "title": createdPost1.title,
                    "shortDescription": createdPost1.shortDescription,
                    "content": createdPost1.content,
                    "blogId": createdPost1.blogId,
                    "blogName": createdPost1.blogName,
                    "createdAt": createdPost1.createdAt
                }]
            })
    })

    let createdPost2: PostDBModel = {
        "id": "",
        "title": "",
        "shortDescription": "shortDescription",
        "content": "",
        "blogId": "",
        "blogName": "",
        "createdAt": "",
        "comments": []
    };

    it('should create one more post with AUTH and correct input data', async () => {

        const data: PostCreateModel = {
            "title": "LaLand VS Ints",
            "shortDescription": "In this article we will look at two great movies - La la land and Interstellar",
            "content": "La la land and Interstellar La la land and Interstellar La la land and Interstellar La la land and Interstellar",
            "blogId": blog.id,
        }

        const {createdPost} = await postsTestManager.createPost(data, STATUSES_HTTP.CREATED_201, authBasicHeader)

        createdPost2 = createdPost!

        await request(app)
            .get(RouterPaths.posts)
            .expect(STATUSES_HTTP.OK_200, {
                pagesCount: 1, page: 1, pageSize: 10, totalCount: 2, items: [{
                    "id": createdPost2.id,
                    "title": createdPost2.title,
                    "shortDescription": createdPost2.shortDescription,
                    "content": createdPost2.content,
                    "blogId": createdPost2.blogId,
                    "blogName": createdPost2.blogName,
                    "createdAt": createdPost2.createdAt
                }, {
                    "id": createdPost1.id,
                    "title": createdPost1.title,
                    "shortDescription": createdPost1.shortDescription,
                    "content": createdPost1.content,
                    "blogId": createdPost1.blogId,
                    "blogName": createdPost1.blogName,
                    "createdAt": createdPost1.createdAt
                }]
            })
    })

    it('should not update post with AUTH and incorrect input data', async () => {

        const data1: PostUpdateModel = {
            "id": createdPost2.id,
            "title": "",
            "shortDescription": "In this article we will look at two great movies - La la land and Interstellar",
            "content": "La la land and Interstellar La la land and Interstellar La la land and Interstellar La la land and Interstellar",
            "blogId": blog.id,
        }

        await request(app)
            .put(`${RouterPaths.posts}/${createdPost2.id}`)
            .set(authBasicHeader)
            .send(data1)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)


        const data2: PostUpdateModel = {
            "id": createdPost2.id,
            "title": "Correct title",
            "shortDescription": "",
            "content": "La la land and Interstellar La la land and Interstellar La la land and Interstellar La la land and Interstellar",
            "blogId": blog.id,
        }

        await request(app)
            .put(`${RouterPaths.posts}/${createdPost2.id}`)
            .set(authBasicHeader)
            .send(data2)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)


        const data3: PostUpdateModel = {
            "id": createdPost2.id,
            "title": "Correct title",
            "shortDescription": "Correct short description",
            "content": "",
            "blogId": blog.id,
        }

        await request(app)
            .put(`${RouterPaths.posts}/${createdPost2.id}`)
            .set(authBasicHeader)
            .send(data3)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)


        await request(app)
            .get(`${RouterPaths.posts}/${createdPost2.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                "id": createdPost2.id,
                "title": createdPost2.title,
                "shortDescription": createdPost2.shortDescription,
                "content": createdPost2.content,
                "blogId": createdPost2.blogId,
                "blogName": createdPost2.blogName,
                "createdAt": createdPost2.createdAt
            })
    })

    it('should update post with AUTH and correct input data', async () => {

        const data: PostUpdateModel = {
            "id": createdPost2.id,
            "title": "NEW TITLE !",
            "shortDescription": "In this article we will look at two great movies - La la land and Interstellar ",
            "content": "La la land and Interstellar La la land and Interstellar La la land and Interstellar La la land and Interstellar",
            "blogId": blog.id,
        }


        await request(app)
            .put(`${RouterPaths.posts}/${createdPost2.id}`)
            .set(authBasicHeader)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        createdPost2.title = "NEW TITLE !"

        await request(app)
            .get(`${RouterPaths.posts}/${createdPost2.id}`)
            .expect(STATUSES_HTTP.OK_200, createdPost2)
    })

    it('should not update post without AUTH and correct input data', async () => {

        const data: PostUpdateModel = {
            "id": createdPost2.id,
            "title": "NEW TITLE 2",
            "shortDescription": "In this article we will look at two great movies - La la land and Interstellar ",
            "content": "La la land and Interstellar La la land and Interstellar La la land and Interstellar La la land and Interstellar",
            "blogId": blog.id,
        }

        await request(app)
            .put(`${RouterPaths.posts}/${createdPost2.id}`)
            .send(data)
            .expect(STATUSES_HTTP.UNAUTHORIZED_401)


        await request(app)
            .get(`${RouterPaths.posts}/${createdPost2.id}`)
            .expect(STATUSES_HTTP.OK_200, createdPost2)
    })

    it('should not update post with AUTH and nonexistent post id', async () => {

        const data: PostUpdateModel = {
            "id": "-2222",
            "title": "NEW TITLE 2",
            "shortDescription": "In this article we will look at two great movies - La la land and Interstellar ",
            "content": "La la land and Interstellar La la land and Interstellar La la land and Interstellar La la land and Interstellar",
            "blogId": blog.id,
        }


        await request(app)
            .put(`${RouterPaths.posts}/${data.id}`)
            .set(authBasicHeader)
            .send(data)
            .expect(STATUSES_HTTP.NOT_FOUND_404)
    })

    it('should not update post with AUTH and nonexistent blog id', async () => {

        const data: PostUpdateModel = {
            "id": createdPost2.id,
            "title": "NEW TITLE 2",
            "shortDescription": "In this article we will look at two great movies - La la land and Interstellar ",
            "content": "La la land and Interstellar La la land and Interstellar La la land and Interstellar La la land and Interstellar",
            "blogId": "-242420002",
        }


        await request(app)
            .put(`${RouterPaths.posts}/${data.id}`)
            .set(authBasicHeader)
            .send(data)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)
    })

    it('should not delete post without AUTH', async () => {

        await request(app)
            .delete(`${RouterPaths.posts}/${createdPost2.id}`)
            .expect(STATUSES_HTTP.UNAUTHORIZED_401)
    })

    it('should not delete post with incorrect ID', async () => {

        await request(app)
            .delete(`${RouterPaths.posts}/-2222222`)
            .set(authBasicHeader)
            .expect(STATUSES_HTTP.NOT_FOUND_404)
    })

    it('should delete post with correct ID and AUTH', async () => {

        await request(app)
            .delete(`${RouterPaths.posts}/${createdPost2.id}`)
            .set(authBasicHeader)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        await request(app)
            .get(RouterPaths.posts)
            .expect(STATUSES_HTTP.OK_200, {
                pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{
                    "id": createdPost1.id,
                    "title": createdPost1.title,
                    "shortDescription": createdPost1.shortDescription,
                    "content": createdPost1.content,
                    "blogId": createdPost1.blogId,
                    "blogName": createdPost1.blogName,
                    "createdAt": createdPost1.createdAt
                }]
            })

    })


    afterAll(async () => {
        // await request(app).delete(`${RouterPaths.testing}/all-data`)

        // // Создаем блог, к которому будем прикреплять посты
        // const data: BlogCreateModel = {
        //     "name": "Richard Feynman",
        //     "description": "Bingo article about Richard Feynman",
        //     "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
        // }
        //
        // const {createdBlog} = await blogsTestManager.createBlog(data, STATUSES_HTTP.CREATED_201, authBasicHeader)
        // blog = createdBlog


        await mongoose.disconnect()
    })
})