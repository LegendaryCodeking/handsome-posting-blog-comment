import request from 'supertest'
import {app} from "../../index";

describe('/blogs', () => {
    beforeAll(async () => {
        await request(app).delete('/testing/all-data')
    })


    it('should return 404 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(404, [])
    })

    it('should return 404 for not existing blog', async () => {
        await request(app)
            .get('/blogs/22222222220')
            .expect(404)
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