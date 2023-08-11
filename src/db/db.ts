import {MongoClient} from 'mongodb'
import {PostType} from "../models/Posts/PostModel";
import {BlogType} from "../models/BLogs/BlogModel";
import dotenv from 'dotenv'
import {UserDBModel} from "../models/Users/UserModel";
import {CommentDbModel} from "../models/Comments/CommentModel";
import {RefreshTokenDbModel} from "../models/Tokens/refreshToken-model";
import {SessionDBModel} from "../models/Sessions/SessionModel";
import {rateLimitDBModel} from "../models/rateLimiting/rateLimitingModel";
dotenv.config()

const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017/";

const client = new MongoClient(mongoUri);
const db = client.db("forum")
export const postsCollection = db.collection<PostType>("posts")
export const blogsCollection = db.collection<BlogType>("blogs")
export const usersCollection = db.collection<UserDBModel>("users")
export const commentsCollection = db.collection<CommentDbModel>("comments")
export const refreshTokenCollection = db.collection<RefreshTokenDbModel>("refreshTokens")
export const sessionsCollection = db.collection<SessionDBModel>("sessions")
export const rateLimitingCollection = db.collection<rateLimitDBModel>("rateLimit")



export async function runDb() {
    try {
        // Connect the client to the server
        await client.connect()
        // Establish and verify connection
        await client.db("shop").command({ping: 1});
        console.log("Successfully connected to MongoDB server")
    } catch {
        console.log("ERROR Did not connect to MongoDB server")
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}
