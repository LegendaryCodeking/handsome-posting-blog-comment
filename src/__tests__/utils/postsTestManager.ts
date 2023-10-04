import request from "supertest";
import {HttpStatusType, STATUSES_HTTP} from "../../enum/http-statuses";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {PostCreateModel} from "../../models/Posts/PostModel";
import {likeStatusModel} from "../../models/Comments/LikeModel";

class NewestLikesClass {
    constructor(protected likesCount: number,
                protected dislikesCount: number,
                protected myStatus: likeStatusModel
                ) {
    }
}



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
                "extendedLikesInfo": {
                     "dislikesCount": expect.any(Number),
                        "likesCount": expect.any(Number),
                         "myStatus": expect.any(String),
                        "newestLikes": expect.any(Array<NewestLikesClass>)
                       }

            })

        }

        return {response, createdPost}
    }
}