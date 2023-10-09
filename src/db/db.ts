import {PostDBModel, postModelType, postMongoSchema} from "../models/Posts/PostModel";
import {BlogDbModel, blogMongoSchema, blogModelType} from "../models/BLogs/BlogModel";
import dotenv from 'dotenv'
import {userMongoSchema} from "../models/Users/UserModel";
import {CommentDbModel, commentModelType, commentMongooseSchema} from "../models/Comments/CommentModel";
import {sessionMongooseSchema} from "../models/Sessions/SessionModel";
import {rateLimitMongooseSchema} from "../models/rateLimiting/rateLimitingModel";
import mongoose from "mongoose";
import {likesMongooseSchema, userslikesconnectionMongooseSchema} from "../models/Comments/LikeModel";

dotenv.config()

const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";

const DbName =  process.env.MONGODBNAME || "forum";

// Mongoose connection section
export const PostModelClass = mongoose.model<PostDBModel,postModelType>('posts', postMongoSchema)
export const BlogModelClass = mongoose.model<BlogDbModel,blogModelType>('blogs', blogMongoSchema)
export const UserModelClass = mongoose.model('users', userMongoSchema)
export const CommentModelClass = mongoose.model<CommentDbModel,commentModelType>('comments', commentMongooseSchema)
export const LikeModelClass = mongoose.model('likes', likesMongooseSchema)
export const UsersLikesConnectionModelClass = mongoose.model('userslikesconnection', userslikesconnectionMongooseSchema)
export const SessionModelClass = mongoose.model('sessions', sessionMongooseSchema)
export const RateLimitModelClass = mongoose.model('rateLimit', rateLimitMongooseSchema)



export async function runDb() {
    try {
        await mongoose.connect(mongoUri + '/' + DbName);
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("ERROR Did not connect to MongoDB server")
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect()
    }
}
