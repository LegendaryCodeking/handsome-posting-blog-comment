import {UserViewModel} from "./UserViewModel";


export type UsersWithPaginationModel = {
    "pagesCount": number,
    "page": number,
    "pageSize": number,
    "totalCount": number,
    "items": UserViewModel[]
}