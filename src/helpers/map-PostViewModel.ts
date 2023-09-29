import {PostType} from "../models/Posts/PostModel";
import {PostViewModel} from "../models/Posts/PostViewModel";
import {PostDBModel} from "../models/Posts/PostDBModel";

export const getPostViewModel = (post: PostType | PostDBModel): PostViewModel => {
    return {
        id: post.id,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt
    }
}