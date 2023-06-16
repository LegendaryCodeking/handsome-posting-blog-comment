import {BlogType} from "../models/BlogModel";
import {blogsRepo} from "../repos/blogs-repo";
import {BlogPostFilterModel} from "../models/FilterModel";
import {postQueryRepo} from "../repos/query-repos/post-query-repo";


export const blogsService = {
    async deleteBlog(id: string): Promise<boolean> {
        return blogsRepo.deleteBlog(id)
    },
    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogType> {
        const createdBlog = {
            "id": (+(new Date())).toString(),
            "name": name,
            "description": description,
            "websiteUrl": websiteUrl,
            "createdAt": new Date().toISOString(),
            "isMembership": false
        }

        return await blogsRepo.createBlog(createdBlog)

    },
    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return blogsRepo.updateBlog(id, name, description, websiteUrl)
    },
    async findPostsByBlogId(queryFilter: BlogPostFilterModel) {
        return postQueryRepo.findPosts(queryFilter)
    }
}