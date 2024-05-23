import client from "../../shared/dbConnection";
import { Meeting } from "../../types";

// get schedule from database
export const getMeetings = async () => {
  const result = (await client
    .db("temp")
    .collection("sessions")
    .find({
      //find all the meetings with a startdate in 2024
      // startDate: {
      //   $gte: new Date("2024-02-29"),
      //   $lt: new Date("2024-02-30"),
      // },
    })
    .toArray()) as unknown as Meeting[];
  console.log("fetching sessions...");
  return result;
};
