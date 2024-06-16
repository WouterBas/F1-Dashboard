import client from "../../shared/dbConnection";
import { Meeting } from "../../types";

// get schedule from database
export const getMeetings = async () => {
  const result = (await client
    .db("f1dashboard")
    .collection("sessions")
    .find({})
    .sort({ startDate: 1 })
    .toArray()) as unknown as Meeting[];
  console.log("fetching sessions...");
  return result;
};

// get schedule from database where there are no drivers
export const getMeetingsWithoutDrivers = async () => {
  const result = (await client
    .db("f1dashboard")
    .collection("sessions")
    .find({
      drivers: { $exists: false },
    })
    .toArray()) as unknown as Meeting[];
  console.log("fetching sessions...");
  return result;
};
