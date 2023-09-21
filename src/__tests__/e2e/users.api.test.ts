import request from 'supertest'

import {STATUSES_HTTP} from "../../enum/http-statuses";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {authBasicHeader, connection_string} from "../utils/export_data_functions";
import {UserCreateModel, UserViewModel} from "../../models/Users/UserModel";
import {usersTestManager} from "../utils/usersTestManager";
import mongoose from "mongoose";

describe('/Testing users', () => {
    beforeAll(async () => {
        await mongoose.connect(connection_string);
    })


    it('Delete all data before tests', async () => {
        await request(app)
            .delete(`${RouterPaths.testing}/all-data`)
            .expect(STATUSES_HTTP.NO_CONTENT_204)
    })

    it('should return 401 without AUTH', async () => {
        await request(app)
            .get(RouterPaths.users)
            .expect(STATUSES_HTTP.UNAUTHORIZED_401)
    })


    it('should return 200 and empty array', async () => {
        await request(app)
            .get(RouterPaths.users)
            .set(authBasicHeader)
            .expect(STATUSES_HTTP.OK_200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    it('should not create user without AUTH', async () => {

        const data: UserCreateModel = {
            "login": "Feynman",
            "password": "Richard8=227",
            "email": "Feynman1918@gmailya.com",
        }

        await usersTestManager.createUser(data, STATUSES_HTTP.UNAUTHORIZED_401)

        await request(app)
            .get(RouterPaths.users)
            .set(authBasicHeader)
            .expect(STATUSES_HTTP.OK_200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })

    let createdUser1: UserViewModel = {
        "id": "",
        "login": "",
        "email": "",
        "createdAt": "",
    };

    it('should NOT create user with AUTH and INCORRECT input data', async () => {

        // Короткий логин
        const data1: UserCreateModel = {
            "login": "FY",
            "password": "Richard8=227",
            "email": "Feynman1918@gmailya.com",
        }

        await usersTestManager.createUser(data1, STATUSES_HTTP.BAD_REQUEST_400, authBasicHeader)

        // Длинный логин
        const data2: UserCreateModel = {
            "login": "FYFYFYFYFY2",
            "password": "Richard8=227",
            "email": "Feynman1918@gmailya.com",
        }

        await usersTestManager.createUser(data2, STATUSES_HTTP.BAD_REQUEST_400, authBasicHeader)
        // Запрещенный символ @ в логине
        const data3: UserCreateModel = {
            "login": "Feynman@",
            "password": "Ric@hard8=227",
            "email": "Feynman1918@gmailya.com",
        }

        await usersTestManager.createUser(data3, STATUSES_HTTP.BAD_REQUEST_400, authBasicHeader)
        // Пароль короткий и длинный
        const data4: UserCreateModel = {
            "login": "Feynman@",
            "password": "7",
            "email": "Feynman1918@gmailya.com",
        }

        await usersTestManager.createUser(data4, STATUSES_HTTP.BAD_REQUEST_400, authBasicHeader)

        const data5: UserCreateModel = {
            "login": "Feynman@",
            "password": "777777777777777777771",
            "email": "Feynman1918@gmailya.com",
        }

        await usersTestManager.createUser(data5, STATUSES_HTTP.BAD_REQUEST_400, authBasicHeader)

        // Проверка email - короткий, длинный, не соответствует регулярному выражению

        const data6: UserCreateModel = {
            "login": "Feynman",
            "password": "Richard8=227",
            "email": "Feynman1918Feynman1918Feynman1918Feynman1918Feynman1918Feynman1918@gmailya.com",
        }

        await usersTestManager.createUser(data6, STATUSES_HTTP.BAD_REQUEST_400, authBasicHeader)

        const data7: UserCreateModel = {
            "login": "Feynman",
            "password": "Richard8=227",
            "email": "Feynm@an1918@gmailya.com",
        }

        await usersTestManager.createUser(data7, STATUSES_HTTP.BAD_REQUEST_400, authBasicHeader)

        const data8: UserCreateModel = {
            "login": "Feynman",
            "password": "Richard8=227",
            "email": "Feynman1918@gmailya.co.m",
        }

        await usersTestManager.createUser(data8, STATUSES_HTTP.BAD_REQUEST_400, authBasicHeader)

        await request(app)
            .get(RouterPaths.users)
            .set(authBasicHeader)
            .expect(STATUSES_HTTP.OK_200, {pagesCount: 0, page: 1, pageSize: 10, totalCount: 0, items: []})
    })


    it('should create user with AUTH and correct input data', async () => {

        const data: UserCreateModel = {
            "login": "Feynman",
            "password": "Richard8=227",
            "email": "Feynman1918@gmailya.com",
        }

        const {createdUser} = await usersTestManager.createUser(data, STATUSES_HTTP.CREATED_201, authBasicHeader)

        createdUser1 = createdUser!

        await request(app)
            .get(RouterPaths.users)
            .set(authBasicHeader)
            .expect(STATUSES_HTTP.OK_200, {
                pagesCount: 1, page: 1, pageSize: 10, totalCount: 1, items: [{
                    "id": createdUser1.id,
                    "login": data.login,
                    "email": data.email,
                    "createdAt": createdUser1.createdAt,
                }]
            })
    })

    afterAll(async () => {
        await mongoose.disconnect()
    })

})