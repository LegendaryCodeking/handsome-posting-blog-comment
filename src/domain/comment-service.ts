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
    }
}