// import MongoClient and ServerApiVersion from mongodb
import { MongoClient, ServerApiVersion } from "mongodb";

// import secret uri
const userName = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASSWORD;
const uri = `mongodb://${userName}:${password}@mongodb:27017/`;

// create new MongoClient instance and export it
export const client = new MongoClient(uri);

export async function getAllSessions() {
  const sessions = await client
    .db("f1dashboard")
    .collection("sessions")
    .find(
      {},
      {
        projection: {
          name: 1,
          type: 1,
          sessionKey: 1,
          _id: 0,
          year: { $year: "$startDate" },
        },
      }
    )
    .sort({ startDate: -1 })
    .toArray();
  return sessions;
}
export async function getSession(id: number) {
  let session;
  try {
    session = await client
      .db("f1dashboard")
      .collection("sessions")
      .aggregate([
        {
          $match: {
            sessionKey: id,
          },
        },
        {
          $lookup: {
            from: "circuits",
            localField: "circuit",
            foreignField: "_id",
            as: "circuitInfo",
          },
        },
      ])
      .toArray();
  } catch (err) {
    console.error(`Failed to get session with id ${id}. Error:`, err);
    throw err;
  }
  if (!session || session.length === 0) {
    console.error(`Session with id ${id} not found.`);
    return null;
  }
  if (session.length > 1) {
    console.error(
      `Found multiple sessions with id ${id}. This should not happen.`
    );
  }
  return session[0];
}

export async function getPosition(id: number, time: Date) {
  const session = await client
    .db("f1dashboard")
    .collection("positions")
    .find(
      {
        sessionKey: id,
        timestamp: {
          $gte: time,
          $lt: new Date(time.getTime() + 5000 * 60),
        },
      },
      { projection: { _id: 0, sessionKey: 0 } }
    )
    .toArray();
  return session;
}
