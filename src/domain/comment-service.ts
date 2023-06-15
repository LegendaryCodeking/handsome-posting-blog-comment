
import {commentsRepo} from "../repos/comments-repo";
import {
    CommentsFilterModel,
    CommentsWithPaginationModel,
    CommentViewModel,
    CreateCommentModel
} from "../models/CommentModel";


export const commentService = {
    async findComments(queryFilter: CommentsFilterModel): Promise<CommentsWithPaginationModel> {
        return commentsRepo.findComments(queryFilter)

    },
    async findCommentById(id: string): Promise<CommentViewModel | null> {
        return commentsRepo.findCommentById(id)
    },
    async updateComment(id: string, content: string): Promise<boolean> {
        return commentsRepo.updateComment(id, content)
    },
    async deleteComment(id: string): Promise<boolean> {
        return commentsRepo.deleteComment(id);
    },
    async createComment(postId: string, content: string, userId: string, userLogin: string): Promise<CommentViewModel> {
        const newComment: CreateCommentModel = {
            // В ID коммента будет вшит ID поста, к которому этот коммент оставлен
            "id": (+(new Date())).toString(),
            "postId": postId,
            "content": content,
            "commentatorInfo": {
                "userId": userId,
                "userLogin": userLogin
            },
            "createdAt": new Date().toISOString()
        }

        return commentsRepo.createComment(newComment);
    }
}