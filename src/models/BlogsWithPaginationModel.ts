import {BlogViewModel} from "./BlogViewModel";


export type BlogsWithPaginationModel = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": BlogViewModel[]
}