// import MongoClient and ServerApiVersion from mongodb
import { MongoClient } from "mongodb";

// import secret uri
const userName = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const uri = `mongodb://${userName}:${password}@mongodb:27017/`;

// create new MongoClient instance and export it
const client = new MongoClient(uri);
export default client;
