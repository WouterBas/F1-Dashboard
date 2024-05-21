import client from "../../shared/dbConnection";
import { Meeting } from "../../types";

// get schedule from database
export const getMeetings = async () => {
  const result = (await client
    .db("temp")
    .collection("sessions")
    .find({
      //find all the meetings with a startdate in 2024
      startDate: {
        $gte: new Date("2024-01-01"),
        $lt: new Date("2025-01-01"),
      },
    })
    .toArray()) as unknown as Meeting[];
  console.log("fetching sessions...");
  return result;
};
