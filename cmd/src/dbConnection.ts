// import MongoClient and ServerApiVersion from mongodb
import { MongoClient, ServerApiVersion } from "mongodb";

// import secret uri
const userName = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const uri = `mongodb://root:123456@localhost:27017/`;

// create new MongoClient instance and export it
export const client = new MongoClient(uri);
