import request from "supertest";
import {HttpStatusType, STATUSES_HTTP} from "../../enum/http-statuses";
import {app} from "../../app_settings";
import {RouterPaths} from "../../helpers/RouterPaths";
import {CreateCommentModel} from "../../models/Comments/CommentModel";
import {likeStatus} from "../../enum/likeStatuses";

export const commentTestManager = {
    async createComment(postId: string, data: CreateCommentModel, expectedStatusCode: HttpStatusType = STATUSES_HTTP.CREATED_201, headers = {}) {
        const response = await request(app)
            .post(`${RouterPaths.posts}/${postId}/comments`)
            .set(headers)
            .send(data)
            .expect(expectedStatusCode)

        let createdComment = null

        if(expectedStatusCode === STATUSES_HTTP.CREATED_201) {

            createdComment = response.body

            expect(createdComment).toEqual({
                "id": expect.any(String),
                "content": data.content,
                "commentatorInfo": {
                    "userId": expect.any(String),
                    "userLogin": expect.any(String)
                },
                "createdAt": expect.any(String),
                "likesInfo": {
                    "likesCount": expect.any(Number),
                    "dislikesCount": expect.any(Number),
                    "myStatus": likeStatus.None
                }

            })

        }

        return {response, createdComment}
    }
}