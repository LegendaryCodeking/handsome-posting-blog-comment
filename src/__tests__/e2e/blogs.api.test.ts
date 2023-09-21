import request from 'supertest'

import {STATUSES_HTTP} from "../../enum/http-statuses";
import {BlogCreateModel, BlogDbModel, BlogUpdateModel} from "../../models/BLogs/BlogModel";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {blogsTestManager} from "../utils/blogsTestManager";
import {authBasicHeader, connection_string} from "../utils/export_data_functions";
import mongoose from "mongoose";

describe('/Testing blogs', () => {
    beforeAll(async () => {
        await mongoose.connect(connection_string);
    })

    it('Delete all data before tests', async () => {
        await request(app)
            .delete(`${RouterPaths.testing}/all-data`)
            .expect(STATUSES_HTTP.NO_CONTENT_204)
    })

    it('should return 404 and empty array', async () => {
        await request(app)
            .get(RouterPaths.blogs)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    it('should return 404 for not existing blog', async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/-22222222220`)
            .expect(STATUSES_HTTP.NOT_FOUND_404)
    })

    it('should not create blog without AUTH', async () => {

        const data: BlogCreateModel = {
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman",
            "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
        }

        await blogsTestManager.createBlog(data, STATUSES_HTTP.UNAUTHORIZED_401)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    /*
    * Created variable outside the next test to have option use
    * id of created blog in the further put test
    * */
    let createdBlog1: BlogDbModel = {
        "id": "",
        "name": "",
        "description": "",
        "websiteUrl": "",
        "createdAt": "",
        "isMembership": false
    };

    it('should create blog with AUTH and correct input data', async () => {

        const data: BlogCreateModel = {
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman",
            "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
        }

        const {createdBlog} = await blogsTestManager.createBlog(data,STATUSES_HTTP.CREATED_201,authBasicHeader)

        createdBlog1 = createdBlog!

        await request(app)
            .get(RouterPaths.blogs)
            .expect(STATUSES_HTTP.OK_200, {
                pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{
                    "id": createdBlog1.id,
                    "name": createdBlog1.name,
                    "description": createdBlog1.description,
                    "websiteUrl": createdBlog1.websiteUrl,
                    "createdAt": createdBlog1.createdAt,
                    "isMembership": createdBlog1.isMembership
                }]
            })
    })

    let createdBlog2: BlogDbModel = {
        "id": "",
        "name": "",
        "description": "",
        "websiteUrl": "",
        "createdAt": "",
        "isMembership": false
    };

    it('should create one more blog with AUTH and correct input data', async () => {

        const data: BlogCreateModel = {
            "name": "Red Fox",
            "description": "Bingo article about Red Fox",
            "websiteUrl": "https://telegra.ph/Red-Fox-03-33"
        }

        const {createdBlog} = await blogsTestManager.createBlog(data,STATUSES_HTTP.CREATED_201,authBasicHeader)

        createdBlog2 = createdBlog!

        await request(app)
            .get(RouterPaths.blogs)
            .expect(STATUSES_HTTP.OK_200, {
                pagesCount: 1, page: 1, pageSize: 10, totalCount: 2, items: [{
                    "id": createdBlog2.id,
                    "name": createdBlog2.name,
                    "description": createdBlog2.description,
                    "websiteUrl": createdBlog2.websiteUrl,
                    "createdAt": createdBlog2.createdAt,
                    "isMembership": createdBlog2.isMembership
                }, {
                    "id": createdBlog1.id,
                    "name": createdBlog1.name,
                    "description": createdBlog1.description,
                    "websiteUrl": createdBlog1.websiteUrl,
                    "createdAt": createdBlog1.createdAt,
                    "isMembership": createdBlog1.isMembership
                }]
            })
    })

    it('should not update blog with AUTH and incorrect input data', async () => {

        const data: BlogUpdateModel = {
            "name": "",
            "description": "Bingo article about Richard Feynman 2222",
            "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
        }

        await request(app)
            .put(`${RouterPaths.blogs}/${createdBlog1.id}`)
            .set(authBasicHeader)
            .send(data)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)


        await request(app)
            .get(`${RouterPaths.blogs}/${createdBlog1.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                "id": createdBlog1.id,
                "name": createdBlog1.name,
                "description": createdBlog1.description,
                "websiteUrl": createdBlog1.websiteUrl,
                "createdAt": createdBlog1.createdAt,
                "isMembership": createdBlog1.isMembership
            })
    })

    it('should update blog with AUTH and correct input data', async () => {

        const data: BlogUpdateModel = {
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman 2222",
            "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
        }


        await request(app)
            .put(`${RouterPaths.blogs}/${createdBlog1.id}`)
            .set(authBasicHeader)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

        createdBlog1.description = "Bingo article about Richard Feynman 2222"
        createdBlog1.websiteUrl = "https://telegra.ph/Richard-Fey2222nman-05-11"

        await request(app)
            .get(`${RouterPaths.blogs}/${createdBlog1.id}`)
            .expect(STATUSES_HTTP.OK_200, createdBlog1)
    })

    it('should not update blog without AUTH and correct input data', async () => {

        const data: BlogUpdateModel = {
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman 33333",
            "websiteUrl": "https://telegra.ph/Richard-Fey33333nman-05-11"
        }

        await request(app)
            .put(`${RouterPaths.blogs}/${createdBlog1.id}`)
            .send(data)
            .expect(STATUSES_HTTP.UNAUTHORIZED_401)


        await request(app)
            .get(`${RouterPaths.blogs}/${createdBlog1.id}`)
            .expect(STATUSES_HTTP.OK_200, createdBlog1)
    })

    it('should not update blog with AUTH and nonexistent id ', async () => {

        const data: BlogUpdateModel = {
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman 2222",
            "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
        }


        await request(app)
            .put(`${RouterPaths.blogs}/-404`)
            .set(authBasicHeader)
            .send(data)
            .expect(STATUSES_HTTP.NOT_FOUND_404)
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })

})