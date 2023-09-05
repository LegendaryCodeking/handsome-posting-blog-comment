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

describe('/Testing comments', () => {
    let post: PostViewModel;
    beforeAll(async () => {
        await request(app).delete(`${RouterPaths.testing}/all-data`)

        // Создаем блог, к которому будем прикреплять пост
        const dataBlog: BlogCreateModel = {
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman",
            "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
        }

        const {createdBlog} = await blogsTestManager.createBlog(dataBlog, STATUSES_HTTP.CREATED_201, authBasicHeader)

        // Создаем пост, к которому будем прикреплять комменты
        const dataPost: PostCreateModel = {
            "title": "amazing Math_1",
            "shortDescription": "Short description about new amazing Math_1 course",
            "content": "Math_1 Math_1 Math_1 Math_1 Math_1 Math_1",
            "blogId": createdBlog.id,
        }

        const {createdPost} = await postsTestManager.createPost(dataPost, STATUSES_HTTP.CREATED_201, authBasicHeader)
        post = createdPost

    })

    it('should return 404 and empty array', async () => {
        await request(app)
            .get(RouterPaths.blogs)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    it('should return 404 for not existing comment', async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/-22222222220`)
            .expect(STATUSES_HTTP.NOT_FOUND_404)
    })

})