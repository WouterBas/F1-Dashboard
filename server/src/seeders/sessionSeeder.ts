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

// const lastSeedingDate = await getLastSeedingDate();

// get schedule from database
const getSchedule = async () => {
  const schedule = (await client
    .db("f1dashboard")
    .collection("schedules")
    .find(
      {
        sessions: {
          $elemMatch: {
            date: {
              $lt: new Date().toISOString().split("T")[0],
            },
          },
        },
      },
      {
        sort: { date: 1 },
      }
    )
    .toArray()) as unknown as Schedule[];
  return schedule;
};
console.log("fetching schedule...");
const schedules = await getSchedule();

async function getSessionsFromDb() {
  const schedule = (await client
    .db("f1dashboard")
    .collection("sessions")
    .find({})
    .toArray()) as unknown as Meeting[];
  return schedule;
}

// insert session info into database
async function seeder() {
  await client.connect();

  await client
    .db("f1dashboard")
    .collection("sessions")
    .createIndexes([{ key: { sessionKey: 1 } }, { key: { startDate: 1 } }]);

  // fetch sessions
  console.log("fetching sessions...");

  const sessions: Meeting[] = [];
  const dbSessions = await getSessionsFromDb();

  for (const schedule of schedules) {
    for (const session of schedule.sessions) {
      console.log(`fetching ${schedule.year} ${schedule.name} ${session.type}`);
      const data = (await getF1Data(
        schedule,
        session,
        "SessionInfo"
      )) as F1Meeting;
      const convertedData: Meeting = convertData(data);
      sessions.push(convertedData);
    }
  }

  const filteredSessions = sessions.filter(
    (session) =>
      !dbSessions.some(
        (dbSession) => dbSession.sessionKey === session.sessionKey
      )
  );
  // insert sessions
  if (filteredSessions.length === 0) {
    console.log("No new sessions to insert");
  } else {
    const result = await client
      .db("f1dashboard")
      .collection("sessions")
      .insertMany(filteredSessions);
    console.log(`${result.insertedCount} sessions were inserted`);
  }

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
  })
  .catch((err) => {
    console.error("Session seeding error:", err);
    process.exit(1);
  });
