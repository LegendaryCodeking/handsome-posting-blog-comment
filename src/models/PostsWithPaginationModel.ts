import {PostViewModel} from "./PostViewModel";

export type PostsWithPaginationModel = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": PostViewModel[]
}