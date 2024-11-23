// import MongoClient and ServerApiVersion from mongodb
import { MongoClient } from 'mongodb';
import { MONGODB_USER, MONGODB_PASSWORD, MONGODB_HOST, MONGODB_PORT } from '$env/static/private';

// import secret uri
const userName = MONGODB_USER;
const password = MONGODB_PASSWORD;
const host = MONGODB_HOST;
const port = MONGODB_PORT;
const uri = `mongodb://${userName}:${password}@${host}:${port}/`;

// create new MongoClient instance and export it
const client = new MongoClient(uri);
export default client;
