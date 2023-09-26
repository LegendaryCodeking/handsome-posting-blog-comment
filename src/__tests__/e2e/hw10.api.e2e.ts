import request from 'supertest'

import {STATUSES_HTTP} from "../../enum/http-statuses";
import {app} from "../../app_settings";
import mongoose from "mongoose";
import {authBasicHeader, connection_string} from "../utils/export_data_functions";
import {RouterPaths} from "../../helpers/RouterPaths";
import {UserCreateModel, UserViewModel} from "../../models/Users/UserModel";
import {usersTestManager} from "../utils/usersTestManager";
import {usersQueryRepo} from "../../repos/query-repos/users-query-repo";

describe('testing password recovery', () => {
    let user: UserViewModel;

    beforeAll(async () => {
        await mongoose.connect(connection_string);

        await request(app).delete(`${RouterPaths.testing}/all-data`)

        //Создаем юзера
        const dataUser: UserCreateModel = {
            "login": "User01",
            "password": "Password01",
            "email": "email01@fishmail2dd.com",
        }

        const {createdUser} = await usersTestManager.createUser(dataUser, STATUSES_HTTP.CREATED_201, authBasicHeader)
        user = createdUser
    });

    it('Check that necessary support objects have been successfully created', async () => {
        expect(user).not.toBeNull();
    })

    it("should send email with code", async () => {
        const data = {
            "email": "email01@fishmail2dd.com"
        }

        await request(app)
            .post(`${RouterPaths.auth}/password-recovery`)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

    })

    it("should return error if password is incorrect; status 400;", async () => {
        const userDB = await usersQueryRepo.findByLoginOrEmail(user.email)
        const data = {
            "newPassword": "short",
            "recoveryCode": userDB!.passwordRecovery!.passwordRecoveryCode
        }

        await request(app)
            .post(`${RouterPaths.auth}/new-password`)
            .send(data)
            .expect(STATUSES_HTTP.BAD_REQUEST_400)

    })


    it("should update password;", async () => {
        const userDB = await usersQueryRepo.findByLoginOrEmail(user.email)
        const data = {
            "newPassword": "new_password",
            "recoveryCode": userDB!.passwordRecovery!.passwordRecoveryCode
        }

        await request(app)
            .post(`${RouterPaths.auth}/new-password`)
            .send(data)
            .expect(STATUSES_HTTP.NO_CONTENT_204)

    })


    afterAll(async () => {
        await mongoose.disconnect()
    })

})

