import client from "../shared/dbConnection";
import { Meeting, F1Meeting, Schedule } from "../types/index";
import getF1Data from "./utils/fetchF1Data";

// get schedule from database
const getSchedule = async () => {
  const schedule = (await client
    .db("temp")
    .collection("schedules")
    .find({
      date: { $lt: new Date().toISOString().split("T")[0] },
    })
    .toArray()) as Schedule[];
  return schedule;
};
console.log("fetching schedule...");
const schedules = await getSchedule();

// insert session info into database
async function seeder() {
  await client.connect();
  const meetings: Meeting[] = [];

  // fetch sessions
  console.log("fetching sessions...");
  await Promise.all(
    schedules.map(async (schedule) => {
      await Promise.all(
        schedule.sessions.map(async (session) => {
          const data = (await getF1Data(
            schedule,
            session,
            "SessionInfo"
          )) as F1Meeting;
          const convertedData: Meeting = convertData(data);
          meetings.push(convertedData);
        })
      );
    })
  );
  // insert sessions
  console.log("inserting sessions...");
  const result = await client
    .db("temp")
    .collection("sessions")
    .insertMany(meetings);
  console.log(`${result.insertedCount} documents were inserted`);

  await client.close();
}

// convert session info from f1 to the format of the database
function convertData(data: F1Meeting) {
  return {
    name: data.Meeting.Name,
    sessionKey: data.Key,
    type: data.Name,
    startDate: new Date(data.StartDate),
    endDate: new Date(data.EndDate),
    gmtOffset: data.GmtOffset,
    url: data.Path,
    circuitKey: data.Meeting.Circuit.Key,
    circuitName: data.Meeting.Circuit.ShortName,
  };
}

seeder()
  .then(() => {
    console.log("Session seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Session seeding error:", err);
    process.exit(1);
  });
