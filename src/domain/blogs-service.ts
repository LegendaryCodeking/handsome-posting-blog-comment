import {BlogType} from "../models/BLogs/BlogModel";
import {blogsRepo} from "../repos/blogs-repo";


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
        //if(limitExeded) throw Error()
        //
        const blog = await blogsRepo.getBlogById() //DomainModel
        //if(blog.countUpdates > 5) throw error
        //blog.name = name
        //blog.repo.save(blog)
        return blogsRepo.updateBlog(id, name, description, websiteUrl)
    }
}