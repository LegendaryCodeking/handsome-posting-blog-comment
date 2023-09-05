import {CommentDbModel} from "../Comments/CommentModel";

export type PostDBModel = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string
    "comments": Array<CommentDbModel>
}