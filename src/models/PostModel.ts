import {CommentModel} from "./CommentModel";
import {CommentViewModel} from "./CommentViewModel";

export type PostType = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string,
    "comments": CommentViewModel[]
}