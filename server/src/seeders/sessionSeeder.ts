import client from "../shared/dbConnection";
import slugify from "slugify";
import {
  Meeting,
  F1Meeting,
  Schedule,
  SessionData,
  StatusSery,
} from "../types/index";
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
    .createIndexes([
      { key: { sessionKey: 1 } },
      { key: { startDate: 1 } },
      { key: { slug: 1 } },
    ]);

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

      if (data === null) {
        console.log(
          `skipping ${schedule.year} ${schedule.name} ${session.type}`
        );
        continue;
      }

      const SessionData: SessionData = (await getF1Data(
        schedule,
        session,
        "SessionData"
      )) as SessionData;

      if (SessionData === null) {
        console.log(
          `skipping ${schedule.year} ${schedule.name} ${session.type}`
        );
        continue;
      }
      const { startDate, endDate } = getStartAndEndDates(SessionData);

      const convertedData: Meeting = convertData(data, startDate, endDate);
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
function convertData(data: F1Meeting, startDate: Date, endDate: Date) {
  return {
    name: data.Meeting.Name,
    sessionKey: data.Key,
    type: data.Name,
    startDate,
    endDate,
    url: "https://livetiming.formula1.com/static/" + data.Path,
    slug: `${slugify(data.Meeting.Name, {
      lower: true,
    })}/${startDate.getFullYear()}/${slugify(data.Name, {
      lower: true,
    })}`,
    circuitKey: data.Meeting.Circuit.Key,
    circuitName: data.Meeting.Circuit.ShortName,
  };
}

// get start and end dates
function getStartAndEndDates(sessionData: SessionData): {
  startDate: Date;
  endDate: Date;
} {
  const startDate = sessionData.StatusSeries.find(
    (series) => series.SessionStatus === "Started"
  );

  const endDate = sessionData.StatusSeries.find(
    (series) => series.SessionStatus === "Finalised"
  );

  if (startDate && endDate) {
    return {
      startDate: new Date(startDate.Utc),
      endDate: new Date(endDate.Utc),
    };
  }
  throw new Error("Start and end dates not found");
}

seeder()
  .then(() => {
    console.log("Session seeding completed");
  })
  .catch((err) => {
    console.error("Session seeding error:", err);
    process.exit(1);
  });
