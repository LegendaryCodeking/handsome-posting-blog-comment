import {extendedLikesInfoViewModel} from "../Comments/LikeModel";

export type PostViewModel = {
    "id": string,
    "title": string,
    "shortDescription": string,
    "content": string,
    "blogId": string,
    "blogName": string,
    "createdAt": string,
    "extendedLikesInfo": extendedLikesInfoViewModel
}