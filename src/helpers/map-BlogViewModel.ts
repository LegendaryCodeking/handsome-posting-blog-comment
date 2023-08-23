import {BlogDbModel} from "../models/BLogs/BlogModel";
import {BlogViewModel} from "../models/BLogs/BlogViewModel";

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