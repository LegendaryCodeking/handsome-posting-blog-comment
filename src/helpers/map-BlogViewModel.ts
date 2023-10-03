import {BlogDbModel,BlogViewModel} from "../models/BLogs/BlogModel";

export const getBlogViewModel = (blog: BlogDbModel): BlogViewModel => {
    return {
        "id": blog.id,
        "name": blog.name,
        "description": blog.description,
        "websiteUrl": blog.websiteUrl,
        "createdAt": blog.createdAt,
        "isMembership": blog.isMembership
    }
}