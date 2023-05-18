import {PostType} from "../models/PostModel";
import {PostViewModel} from "../models/PostViewModel";
import {postsCollection} from "./db";

const getPostViewModel = (post: PostType): PostViewModel => {
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

export const postsRepo = {
    async findPosts(): Promise<PostType[]> {
        return postsCollection.find({}).map(post => getPostViewModel(post)).toArray();
    },
    async findProductById(id: string): Promise<PostType | null> {
        let foundPost: PostType | null = await postsCollection.findOne({"id": id})
        if (foundPost) {
            return getPostViewModel(foundPost)
        } else {
            return null
        }
    },
    async deletePost(id: string): Promise<boolean> {
        let result = await postsCollection.deleteOne({"id": id})
        return result.deletedCount === 1
    },
    async createPost(title: string, shortDescription: string, content: string, blogId: string): Promise<PostType> {
        const createdPost = {
            "id": (+(new Date())).toString(),
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId,
            "blogName": "BlogName",
            "createdAt": new Date().toISOString()

        };

        await postsCollection.insertOne(createdPost)
        return getPostViewModel(createdPost);
    },
    async updatePost(id: string, title: string, shortDescription: string, content: string, blogId: string): Promise<boolean> {
        let result = await postsCollection.updateOne({"id": id}, {
            title: title,
            shortDescription: shortDescription,
            content: content,
            blogId: blogId
        })
        return result.matchedCount === 1
    },
    async deleteAll() {
        await postsCollection.deleteMany({})
    }
}