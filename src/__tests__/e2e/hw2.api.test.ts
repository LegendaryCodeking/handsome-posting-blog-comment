import request from 'supertest'
import {app} from "../../index";
import {STATUSES_HTTP} from "../../routes/http-statuses-const";
import * as string_decoder from "string_decoder";

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })


    it('should return 404 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(STATUSES_HTTP.NOT_FOUND_404, [])
    })

    it('should return 404 for not existing blog', async () => {
        await request(app)
            .get('/blogs/22222222220')
            .expect(STATUSES_HTTP.NOT_FOUND_404)
    })

    it('should not create blog without AUTH', async () => {
        await request(app)
            .post('/blogs')
            .send({
                "name": "Richard Feynman",
                "description": "Bingo article about Richard Feynman",
                "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11"
            })
            .expect(STATUSES_HTTP.UNAUTHORIZED_401)

        await request(app)
            .get('/blogs')
            .expect(STATUSES_HTTP.NOT_FOUND_404, [])
    })

    it('should create blog with AUTH and correct input data', async () => {
        let readyResponse = await request(app)
            .post('/blogs')
            .set({Authorization: "Basic YWRtaW46cXdlcnR5"})
            .send({
                "name": "Richard Feynman",
                "description": "Bingo article about Richard Feynman",
                "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11"
            })
            .expect(STATUSES_HTTP.CREATED_201)

        const createdBlog = readyResponse.body

        expect(createdBlog).toEqual({
            "id": expect.any(String),
            "name": "Richard Feynman",
            "description": "Bingo article about Richard Feynman",
            "websiteUrl": "https://telegra.ph/Richard-Feynman-05-11"
        })

        await request(app)
            .get('/blogs')
            .expect(STATUSES_HTTP.OK_200, [createdBlog])
    })


    // it('', () => {
    //
    // })
    // it('', () => {
    //
    // })
    // it('', () => {
    //
    // })
    // it('', () => {
    //
    // })
    // it('', () => {
    //
    // })
    // it('', () => {
    //
    // })
    // it('', () => {
    //
    // })
})