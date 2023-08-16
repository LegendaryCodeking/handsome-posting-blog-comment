import {NextFunction, Request, Response} from "express";
import {Filter, ObjectId} from "mongodb";
import {rateLimitingCollection} from "../db/db";
import {rateLimitDBModel, rateLimitViewModel} from "../models/rateLimiting/rateLimitingModel";
import subSeconds from "date-fns/subSeconds";



export const IpRateLimitMW = async (req: Request, res: Response, next: NextFunction) => {
    const newAPIUsage: rateLimitDBModel  = {
        _id: new ObjectId(),
        IP: req.headers['x-forwarded-for'] || req.socket.remoteAddress || "undefined",
        URL: req.baseUrl + req.url || req.originalUrl,
        date: new Date()
    }

    await rateLimitingCollection.insertOne(newAPIUsage)


    const filter: Filter<rateLimitViewModel>  = {IP: newAPIUsage.IP, URL: newAPIUsage.URL, date: {$gte: subSeconds(new Date(), 10) }}

    const APIUsageByIP = await rateLimitingCollection.countDocuments(filter)

    if (APIUsageByIP > 5) {
        res.status(429)
            .json({errorsMessages: [{message: "Too many requests"}]}
            )
        return
    }

    next();
}