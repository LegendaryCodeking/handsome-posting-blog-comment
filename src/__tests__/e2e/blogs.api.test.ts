import request from 'supertest'

import {STATUSES_HTTP} from "../../enum/http-statuses";
import {BlogType} from "../../models/BLogs/BlogModel";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";

describe('/Testing blogs', () => {
    beforeAll(async () => {
        await request(app).delete(`${RouterPaths.testing}/all-data`)
    })


    it('should return 404 and empty array', async () => {
        await request(app)
            .get(RouterPaths.blogs)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    it('should return 404 for not existing blog', async () => {
        await request(app)
            .get(`${RouterPaths.blogs}/22222222220`)
            .expect(STATUSES_HTTP.NOT_FOUND_404)
    })

    it('should not create blog without AUTH', async () => {
        await request(app)
            .post(RouterPaths.blogs)
            .send({
                "name": "Richard Feynman",
                "description": "Bingo article about Richard Feynman",
                "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
                "createdAt": "2023-05-18T11:39:35.408Z",
                "isMembership": true
            })
            .expect(STATUSES_HTTP.UNAUTHORIZED_401)

        await request(app)
            .get(RouterPaths.blogs)
            .expect(STATUSES_HTTP.NOT_FOUND_404, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    /*
    * Created variable outside the next test to have option use
    * id of created blog in the further put test
    * */
    let createdBlog1: BlogType = {
        "id": "",
        "name": "",
        "description": "",
        "websiteUrl": "",
        "createdAt": "",
        "isMembership": false
    };

    it('should create blog with AUTH and correct input data', async () => {
        let readyResponse = await request(app)
            .post(RouterPaths.blogs)
            .set({Authorization: "Basic YWRtaW46cXdlcnR5"})
            .send({
                "name": "Richard Feynman",
                "description": "Bingo article about Richard Feynman",
                "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
            })
            .expect(STATUSES_HTTP.CREATED_201)

        createdBlog1 = readyResponse.body

        expect(createdBlog1).toEqual({
            "id": expect.any(String),
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman",
            "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11",
            "createdAt": expect.any(String),
            "isMembership": false

        })

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

    let createdBlog2: BlogType = {
        "id": "",
        "name": "",
        "description": "",
        "websiteUrl": "",
        "createdAt": "",
        "isMembership": false
    };

    it('should create one more blog with AUTH and correct input data', async () => {
        let readyResponse = await request(app)
            .post(RouterPaths.blogs)
            .set({Authorization: "Basic YWRtaW46cXdlcnR5"})
            .send({
                "name": "Red Fox",
                "description": "Bingo article about Red Fox",
                "websiteUrl": "https://telegra.ph/Red-Fox-03-33"
            })
            .expect(STATUSES_HTTP.CREATED_201)

        createdBlog2 = readyResponse.body

        expect(createdBlog2).toEqual({
            "id": expect.any(String),
            "name": "Red Fox",
            "description": "Bingo article about Red Fox",
            "websiteUrl": "https://telegra.ph/Red-Fox-03-33",
            "createdAt": expect.any(String),
            "isMembership": false
        })

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
        await request(app)
            .put(`${RouterPaths.blogs}/${createdBlog1.id}`)
            .set({Authorization: "Basic YWRtaW46cXdlcnR5"})
            .send({
                "name": "",
                "description": "Bingo article about Richard Feynman 2222",
                "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
            })
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
        await request(app)
            .put(`${RouterPaths.blogs}/${createdBlog1.id}`)
            .set({Authorization: "Basic YWRtaW46cXdlcnR5"})
            .send({
                "name": "Richard Feynman",
                "description": "Bingo article about Richard Feynman 2222",
                "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
            })
            .expect(STATUSES_HTTP.NO_CONTENT_204)


        await request(app)
            .get(`${RouterPaths.blogs}/${createdBlog1.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                "id": createdBlog1.id,
                "name": createdBlog1.name,
                "description": "Bingo article about Richard Feynman 2222",
                "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11",
                "createdAt": createdBlog1.createdAt,
                "isMembership": createdBlog1.isMembership
            })
    })

    it('should not update blog without AUTH and correct input data', async () => {
        await request(app)
            .put(`${RouterPaths.blogs}/${createdBlog1.id}`)
            .send({
                "name": "Richard Feynman",
                "description": "Bingo article about Richard Feynman 33333",
                "websiteUrl": "https://telegra.ph/Richard-Fey33333nman-05-11"
            })
            .expect(STATUSES_HTTP.UNAUTHORIZED_401)


        await request(app)
            .get(`${RouterPaths.blogs}/${createdBlog1.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                "id": createdBlog1.id,
                "name": createdBlog1.name,
                "description": "Bingo article about Richard Feynman 2222",
                "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11",
                "createdAt": createdBlog1.createdAt,
                "isMembership": createdBlog1.isMembership
            })
    })

    it('should not update blog with AUTH and nonexistent шв ', async () => {
        await request(app)
            .put(`${RouterPaths.blogs}/404`)
            .set({Authorization: "Basic YWRtaW46cXdlcnR5"})
            .send({
                "name": "Richard Feynman",
                "description": "Bingo article about Richard Feynman 2222",
                "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
            })
            .expect(STATUSES_HTTP.NOT_FOUND_404)
    })

})