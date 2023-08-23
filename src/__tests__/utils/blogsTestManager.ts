import request from "supertest";
import {BlogCreateModel} from "../../models/BLogs/BlogModel";
import {HttpStatusType, STATUSES_HTTP} from "../../enum/http-statuses";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";

export const blogsTestManager = {
    async createBlog(data: BlogCreateModel, expectedStatusCode: HttpStatusType = STATUSES_HTTP.CREATED_201, headers = {}) {
        const response = await request(app)
            .post(RouterPaths.blogs)
            .set(headers)
            .send(data)
            .expect(expectedStatusCode)

        let createdBlog = null

        if(expectedStatusCode === STATUSES_HTTP.CREATED_201) {
            expect(createdBlog).toEqual({
                "id": expect.any(String),
                "name": data.name,
                "description": data.description,
                "websiteUrl": data.websiteUrl,
                "createdAt": expect.any(String),
                "isMembership": false

            })
        }

        return {response, createdBlog}
    }
}