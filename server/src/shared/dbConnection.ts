// import MongoClient and ServerApiVersion from mongodb
import { MongoClient } from "mongodb";

// import secret uri
const userName = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const host = process.env.MONGODB_HOST;
const port = process.env.MONGODB_PORT;
const uri = `mongodb://${userName}:${password}@${host}:${port}/`;

// create new MongoClient instance and export it
const client = new MongoClient(uri);
export default client;
