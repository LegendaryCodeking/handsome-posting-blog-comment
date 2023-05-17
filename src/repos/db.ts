import {MongoClient} from 'mongodb'

const mongoUri = process.env.mongoURI || "mongodb://0.0.0.0:27017/";

const client = new MongoClient(mongoUri);
const db = client.db("forum")

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
