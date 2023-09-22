import {NextFunction, Request, Response} from "express";
import {ObjectId} from "mongodb";
import {FilterQuery} from "mongoose";
import {RateLimitModel} from "../db/db";
import {rateLimitDBModel, rateLimitViewModel} from "../models/rateLimiting/rateLimitingModel";
import subSeconds from "date-fns/subSeconds";


export const IpRateLimitMW = async (req: Request, res: Response, next: NextFunction) => {

    const newAPIUsage: rateLimitDBModel  = {
        _id: new ObjectId(),
        IP: req.headers['x-forwarded-for'] || req.socket.remoteAddress || "undefined",
        URL: req.baseUrl + req.url || req.originalUrl,
        date: new Date()
    }

    await RateLimitModel.insertMany([newAPIUsage])


    const filter: FilterQuery<rateLimitViewModel>  = {IP: newAPIUsage.IP, URL: newAPIUsage.URL, date: {$gt: subSeconds(new Date(), 10) }}

    const APIUsageByIP = await RateLimitModel.countDocuments(filter)

    if (APIUsageByIP > 5) {
        res.status(429)
            .json({errorsMessages: [{message: "Too many requests"}]}
            )
        return
    }

    next();
}