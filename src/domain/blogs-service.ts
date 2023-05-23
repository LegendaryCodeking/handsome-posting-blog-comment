import {BlogType} from "../models/BlogModel";
import {blogsRepo} from "../repos/blogs-repo";
import {FilterModel} from "../models/BlogsFilterModel";
import {BlogsWithPaginationModel} from "../models/BlogsWithPaginationModel";
import {postsRepo} from "../repos/posts-repo";


export const blogsService = {
    async findBlogs(queryFilter: FilterModel): Promise<BlogsWithPaginationModel> {
        return blogsRepo.findBlogs(queryFilter);
    },
    async findBlogById(id: string): Promise<BlogType | null> {
        return blogsRepo.findBlogById(id)
    },
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
    async deleteAll() {
        await blogsRepo.deleteAll();

    },
    async findPostsByBlogId(queryFilter: FilterModel) {
        return postsRepo.findPosts(queryFilter)
    }
}