import {CommentsRepo} from "../repos/comments-repo";
import {
    CommentDbModel,
    CommentViewModel
} from "../models/Comments/CommentModel";
import {ObjectId} from "mongodb";

export class CommentService {

    constructor(protected commentsRepo: CommentsRepo) {    }

    async updateComment(id: string, content: string): Promise<boolean> {
        return this.commentsRepo.updateComment(id, content)
    }

    async deleteComment(id: string): Promise<boolean> {
        return this.commentsRepo.deleteComment(id);
    }

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

        return this.commentsRepo.createComment(newComment);
    }
}