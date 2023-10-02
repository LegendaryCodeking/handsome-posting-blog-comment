import request from "supertest";
import {HttpStatusType, STATUSES_HTTP} from "../../enum/http-statuses";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {PostCreateModel} from "../../models/Posts/PostCreateModel";

export const postsTestManager = {
    async createPost(data: PostCreateModel, expectedStatusCode: HttpStatusType = STATUSES_HTTP.CREATED_201, headers = {}) {
        const response = await request(app)
            .post(RouterPaths.posts)
            .set(headers)
            .send(data)
            .expect(expectedStatusCode)

        let createdPost = null

        if(expectedStatusCode === STATUSES_HTTP.CREATED_201) {

            createdPost = response.body


            expect(createdPost).toEqual({
                "id": expect.any(String),
                "title": data.title,
                "shortDescription": data.shortDescription,
                "content": data.content,
                "blogId": data.blogId,
                "blogName": expect.any(String),
                "createdAt": expect.any(String),
                "extendedLikesInfo": expect.any(Array)

            })

        }

        return {response, createdPost}
    }
}