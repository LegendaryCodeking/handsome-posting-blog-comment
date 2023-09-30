import {CommentDbModel} from "../Comments/CommentModel";

export class PostDBModel {
    constructor(
        public id: string,
        public title: string,
        public shortDescription: string,
        public content: string,
        public blogId: string,
        public blogName: string,
        public createdAt: string,
        public comments: Array<CommentDbModel>
    ) {
    }
}
//
// export type PostDBModel = {
//     "id": string,
//     "title": string,
//     "shortDescription": string,
//     "content": string,
//     "blogId": string,
//     "blogName": string,
//     "createdAt": string,
//     "comments": Array<CommentDbModel>
// }