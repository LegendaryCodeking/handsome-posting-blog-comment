
import {commentsRepo} from "../repos/comments-repo";
import {
    CommentDbModel,
    CommentViewModel
} from "../models/Comments/CommentModel";
import {ObjectId} from "mongodb";


export const commentService = {
    async updateComment(id: string, content: string): Promise<boolean> {
        return commentsRepo.updateComment(id, content)
    },
    async deleteComment(id: string): Promise<boolean> {
        return commentsRepo.deleteComment(id);
    },
    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentViewModel> {
        const newComment = new CommentDbModel(
            new ObjectId(),
            postId,
            content,
            {
                "userId": userId,
                "userLogin": userLogin
            },
            new Date().toISOString()
        )

        return commentsRepo.createComment(newComment);
    }
}