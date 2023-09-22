import {WithId} from "mongodb";
import mongoose from "mongoose";

export type rateLimitDBModel = WithId<{
    IP: string | string[]
    URL: string
    date: Date
}>

export type rateLimitViewModel = {
    IP: string | string[]
    URL: string
    date: Date
}

export const rateLimitMongooseSchema = new mongoose.Schema<rateLimitDBModel>({
    IP: String || [String],
    URL: String,
    date: Date
})