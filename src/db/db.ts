import {postMongoSchema} from "../models/Posts/PostModel";
import {blogMongoSchema} from "../models/BLogs/BlogModel";
import dotenv from 'dotenv'
import {userMongoSchema} from "../models/Users/UserModel";
import {commentMongooseSchema} from "../models/Comments/CommentModel";
import {sessionMongooseSchema} from "../models/Sessions/SessionModel";
import {rateLimitMongooseSchema} from "../models/rateLimiting/rateLimitingModel";
import mongoose from "mongoose";
import {likesMongooseSchema} from "../models/Comments/LikeModel";

dotenv.config()

const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";

const DbName =  process.env.MONGODBNAME || "forum";

// Mongoose connection section
export const PostModelClass = mongoose.model('posts', postMongoSchema)
export const BlogModelClass = mongoose.model('blogs', blogMongoSchema)
export const UserModelClass = mongoose.model('users', userMongoSchema)
export const CommentModelClass = mongoose.model('comments', commentMongooseSchema)
export const LikeModelClass = mongoose.model('likes', likesMongooseSchema)
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
