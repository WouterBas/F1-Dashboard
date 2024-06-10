import client from "../shared/dbConnection";
import { Meeting, F1Meeting, Schedule } from "../types/index";
import getF1Data from "./utils/fetchF1Data";

async function getLastSeedingDate() {
  const result = (await client
    .db("f1dashboard")
    .collection("seeding")
    .findOne({})) as unknown as { lastSeedingDate: Date };
  return result.lastSeedingDate;
}

const lastSeedingDate = await getLastSeedingDate();

// get schedule from database
const getSchedule = async () => {
  const schedule = (await client
    .db("f1dashboard")
    .collection("schedules")
    .find(
      {
        date: {
          $lt: new Date().toISOString().split("T")[0],
        },
      },
      {
        sort: { date: 1 },
      }
    )
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

  for (const schedule of schedules) {
    console.log(`fetching ${schedule.year} ${schedule.name}`);
    for (const session of schedule.sessions) {
      const data = (await getF1Data(
        schedule,
        session,
        "SessionInfo"
      )) as F1Meeting;
      const convertedData: Meeting = convertData(data);
      meetings.push(convertedData);
    }
  }

  //insert sessions
  console.log("inserting sessions...");
  const result = await client
    .db("f1dashboard")
    .collection("sessions")
    .insertMany(meetings);
  console.log(`${result.insertedCount} sessions were inserted`);

  await client.close();
}

// convert session info from f1 to the format of the database
function convertData(data: F1Meeting) {
  const offset =
    data.GmtOffset[0] !== "-"
      ? (data.GmtOffset = "+" + data.GmtOffset.slice(0, -3))
      : (data.GmtOffset = data.GmtOffset.slice(0, -3));
  return {
    name: data.Meeting.Name,
    sessionKey: data.Key,
    type: data.Name,
    startDate: new Date(data.StartDate + offset),
    endDate: new Date(data.EndDate + offset),
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
