import {MongoClient} from 'mongodb'
import {postMongoSchema} from "../models/Posts/PostModel";
import {blogMongoSchema} from "../models/BLogs/BlogModel";
import dotenv from 'dotenv'
import {userMongoSchema} from "../models/Users/UserModel";
import {commentMongooseSchema} from "../models/Comments/CommentModel";
import {sessionMongooseSchema} from "../models/Sessions/SessionModel";
import {rateLimitMongooseSchema} from "../models/rateLimiting/rateLimitingModel";
import mongoose from "mongoose";

dotenv.config()

const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017";

const client = new MongoClient(mongoUri);
const db = client.db("forum")

const DbName =  process.env.MONGODBNAME || "forum";

// Mongoose connection section
export const PostModel = mongoose.model('posts', postMongoSchema)
export const BlogModel = mongoose.model('blogs', blogMongoSchema)
export const UserModel = mongoose.model('users', userMongoSchema)
export const CommentModel = mongoose.model('comments', commentMongooseSchema)
export const SessionModel = mongoose.model('sessions', sessionMongooseSchema)
export const RateLimitModel = mongoose.model('rateLimit', rateLimitMongooseSchema)



export async function runDb() {
    try {
        // Connect the client to the server
        // await client.connect()
        // // Establish and verify connection
        // await client.db("shop").command({ping: 1});
        // console.log("Successfully connected to MongoDB server")
        await mongoose.connect(mongoUri + '/' + DbName);
        console.log("Connected successfully to mongo server");
    } catch {
        console.log("ERROR Did not connect to MongoDB server")
        // Ensures that the client will close when you finish/error
        await mongoose.disconnect()
    }
}
