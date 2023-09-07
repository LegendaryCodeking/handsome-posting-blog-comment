import request from "supertest";
import {HttpStatusType, STATUSES_HTTP} from "../../enum/http-statuses";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {UserCreateModel} from "../../models/Users/UserModel";

export const usersTestManager = {
    async createUser(data: UserCreateModel, expectedStatusCode: HttpStatusType = STATUSES_HTTP.CREATED_201, headers = {}) {
        const response = await request(app)
            .post(RouterPaths.users)
            .set(headers)
            .send(data)
            .expect(expectedStatusCode)

        let createdUser = null

        if(expectedStatusCode === STATUSES_HTTP.CREATED_201) {

            createdUser = response.body

            expect(createdUser).toEqual({
                "id": expect.any(String),
                "login": data.login,
                "email": data.email,
                "createdAt": expect.any(String),

            })
        }
        return {response, createdUser}
    }
}