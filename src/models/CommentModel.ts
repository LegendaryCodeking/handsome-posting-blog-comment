export type CommentModel = {
    "id": string,
    "content": string,
    "commentatorInfo": CommentatorInfoType,
    "createdAt": string
}

export type CommentatorInfoType = {
    "userId": string,
    "userLogin": string
}