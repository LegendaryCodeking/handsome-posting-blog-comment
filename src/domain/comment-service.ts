import {CommentViewModel} from "../models/CommentViewModel";
import {commentsRepo} from "../repos/comments-repo";


export const commentService = {
    async findCommentById(id: string): Promise<CommentViewModel | null> {
        return commentsRepo.findCommentById(id)
    },
    async updateComment(id: string, content: string): Promise<boolean> {
        return commentsRepo.updateComment(id, content)
    },
    async deleteComment(id: string): Promise<boolean> {
        return commentsRepo.deleteComment(id);
    },
    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<boolean> {
        const newComment: CommentViewModel = {
            // В ID коммента будет вшит ID поста, к которому этот коммент оставлен
            "id": postId + "_._._" + (+(new Date())).toString(),
            "content": content,
            "commentatorInfo": {
                "userId": userId,
                "userLogin": userLogin
            },
            "createdAt": new Date().toISOString()
        }

        return commentsRepo.createComment(postId, newComment);
    }
}