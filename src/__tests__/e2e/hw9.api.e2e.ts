import request from 'supertest'

import {STATUSES_HTTP} from "../../enum/http-statuses";
import {app} from "../../app_settings";
import {Response} from "supertest";
import mongoose from "mongoose";
import {connection_string} from "../utils/export_data_functions";
import {RouterPaths} from "../../helpers/RouterPaths";

describe('testing ip restriction for registration', () => {
    beforeAll(async () => {
        await mongoose.connect(connection_string);
    });

    it('Delete all data before tests', async () => {
        await request(app)
            .delete(`${RouterPaths.testing}/all-data`)
            .expect(STATUSES_HTTP.NO_CONTENT_204)
    })


    it("should return 429 error ", async () => {

        const res1: Response = await request(app)
            .post(`/auth/registration`)
            .set('Content-Type', 'application/json')
            .send({
                login: "User16666",
                password: "User16666",
                email: "User1@mail.ru"
            })
            .expect(STATUSES_HTTP.NO_CONTENT_204);

        const res2: Response = await request(app)
            .post(`/auth/registration`)
            .set('Content-Type', 'application/json')
            .send({
                login: "User2666",
                password: "User2666",
                email: "User2@mail.ru"
            })
            .expect(STATUSES_HTTP.NO_CONTENT_204);

        const res3: Response = await request(app)
            .post(`/auth/registration`)
            .set('Content-Type', 'application/json')
            .send({
                login: "User3666",
                password: "User3666",
                email: "User3@mail.ru"
            })
            .expect(STATUSES_HTTP.NO_CONTENT_204);

        const res4: Response = await request(app)
            .post(`/auth/registration`)
            .set('Content-Type', 'application/json')
            .send({
                login: "User4666",
                password: "User4666",
                email: "User4@mail.ru"
            })
            .expect(STATUSES_HTTP.NO_CONTENT_204);

        const res5: Response = await request(app)
            .post(`/auth/registration`)
            .set('Content-Type', 'application/json')
            .send({
                login: "User5666",
                password: "User5666",
                email: "User5@mail.ru"
            })
            .expect(STATUSES_HTTP.NO_CONTENT_204);

        const res6: Response = await request(app)
            .post(`/auth/registration`)
            .set('Content-Type', 'application/json')
            .send({
                login: "User6666",
                password: "User6666",
                email: "User6@mail.ru"
            })
            .expect(STATUSES_HTTP.TOO_MANY_REQUESTS_429);

    }, 50000)


    afterAll(async () => {
        await mongoose.disconnect()
    })

})

