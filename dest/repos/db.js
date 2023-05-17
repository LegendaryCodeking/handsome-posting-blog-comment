"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDb = exports.blogsCollection = exports.postsCollection = void 0;
const mongodb_1 = require("mongodb");
const mongoUri = process.env.MONGO_URL || "mongodb://0.0.0.0:27017/";
const client = new mongodb_1.MongoClient(mongoUri);
const db = client.db("forum");
exports.postsCollection = db.collection("posts");
exports.blogsCollection = db.collection("blogs");
function runDb() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Connect the client to the server
            yield client.connect();
            // Establish and verify connection
            yield client.db("shop").command({ ping: 1 });
            console.log("Successfully connected to MongoDB server");
        }
        catch (_a) {
            console.log("ERROR Did not connect to MongoDB server");
            // Ensures that the client will close when you finish/error
            yield client.close();
        }
    });
}
exports.runDb = runDb;
