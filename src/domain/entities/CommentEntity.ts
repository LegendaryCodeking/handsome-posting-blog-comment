import {ObjectId} from "mongodb";
import mongoose, {Model} from "mongoose";
import {CommentDbModel} from "../../models/Comments/CommentModel";

export type commentDBMethodsType = {
    updateComment: (content: string) => void
}

export type commentModelType = Model<CommentDbModel,{},commentDBMethodsType>



export const commentMongooseSchema = new mongoose.Schema<CommentDbModel,commentModelType,commentDBMethodsType>({
    _id: ObjectId,
    postId: String,
    content: String,
    commentatorInfo: {
        userId: String,
        userLogin: String
    },
    createdAt: String
})

commentMongooseSchema.method('updateComment', function commentMongooseSchema(content: string): void {
    this.content = content
});