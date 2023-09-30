import {BlogDbModel} from "../models/BLogs/BlogModel";
import {blogsRepo} from "../repos/blogs-repo";

class BlogsService {
    async deleteBlog(id: string): Promise<boolean> {
        return blogsRepo.deleteBlog(id)
    }

    async createBlog(name: string, description: string, websiteUrl: string): Promise<BlogDbModel> {

        const createdBlog = new BlogDbModel(
            (+(new Date())).toString(),
            name,
            description,
            websiteUrl,
            new Date().toISOString(),
            false
        )

        return await blogsRepo.createBlog(createdBlog)

    }

    async updateBlog(id: string, name: string, description: string, websiteUrl: string): Promise<boolean> {
        return blogsRepo.updateBlog(id, name, description, websiteUrl)
    }
}

export const blogsService = new BlogsService()