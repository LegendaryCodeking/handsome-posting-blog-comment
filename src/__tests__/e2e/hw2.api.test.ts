import request from 'supertest'
import {app} from "../../index";
import {STATUSES_HTTP} from "../../routes/http-statuses-const";
import * as string_decoder from "string_decoder";
import {BlogType} from "../../models/BlogModel";

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

    /*
    * Created variable outside the next test to have option use
    * id of created blog in the further put test
    * */
    let createdBlog: BlogType = {
        "id": "",
        "name": "",
        "description": "",
        "websiteUrl": ""
    };

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

        createdBlog = readyResponse.body

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

    it('should not update blog with AUTH and incorrect input data', async () => {
        await request(app)
            .put(`/blogs/${createdBlog.id}`)
            .set({Authorization: "Basic YWRtaW46cXdlcnR5"})
            .send({
                "name": "",
                "description": "Bingo article about Richard Feynman 2222",
                "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
            })
            .expect(STATUSES_HTTP.BAD_REQUEST_400)


        await request(app)
            .get(`/blogs/${createdBlog.id}`)
            .expect(STATUSES_HTTP.OK_200, createdBlog)
    })

    it('should update blog with AUTH and correct input data', async () => {
        await request(app)
            .put(`/blogs/${createdBlog.id}`)
            .set({Authorization: "Basic YWRtaW46cXdlcnR5"})
            .send({
                "name": "Richard Feynman",
                "description": "Bingo article about Richard Feynman 2222",
                "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
            })
            .expect(STATUSES_HTTP.NO_CONTENT_204)


        await request(app)
            .get(`/blogs/${createdBlog.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                ...createdBlog,
                "description": "Bingo article about Richard Feynman 2222",
                "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
            })
    })

    it('should not update blog without AUTH and correct input data', async () => {
        await request(app)
            .put(`/blogs/${createdBlog.id}`)
            .send({
                "name": "Richard Feynman",
                "description": "Bingo article about Richard Feynman 33333",
                "websiteUrl": "https://telegra.ph/Richard-Fey33333nman-05-11"
            })
            .expect(STATUSES_HTTP.UNAUTHORIZED_401)


        await request(app)
            .get(`/blogs/${createdBlog.id}`)
            .expect(STATUSES_HTTP.OK_200, {
                ...createdBlog,
                "description": "Bingo article about Richard Feynman 2222",
                "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
            })
    })

    it('should not update blog with AUTH and nonexistent шв ', async () => {
        await request(app)
            .put(`/blogs/404`)
            .set({Authorization: "Basic YWRtaW46cXdlcnR5"})
            .send({
                "name": "Richard Feynman",
                "description": "Bingo article about Richard Feynman 2222",
                "websiteUrl": "https://telegra.ph/Richard-Fey2222nman-05-11"
            })
            .expect(STATUSES_HTTP.NOT_FOUND_404)
    })


})