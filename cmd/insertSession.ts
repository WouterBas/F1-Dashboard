import { Driver, Session } from "../server/src/types/models";
import { MongoClient } from "mongodb";
import { NewDriver, NewSession } from "../server/src/types/models";
import { client } from "../server/src/db";

async function getSchedule() {
  const schedule = await client
    .db("f1dashboard")
    .collection("schedules")
    .find()
    .toArray();
  return schedule;
}

async function main() {
  const schedule = await getSchedule();
  schedule.forEach(async (sh) => {
    sh.sessions.forEach(async (s: object) => {
      for (const [key, value] of Object.entries(s)) {
        const url = `https://livetiming.formula1.com/static/${sh.year}/${
          sh.sessions[4].Race
        }_${sh.name.replaceAll(" ", "_")}/${value}_${key}/`;

        const sessionFetch = await fetch(`${url}SessionInfo.json`);
        if (sessionFetch.status === 404) {
          console.log(`${url}Index.json`);
          continue;
        }
        const session: Session = await sessionFetch.json();
        const driverFetch = await fetch(`${url}DriverList.json`);

        const drivers: Driver[] = await driverFetch.json();

        const newDrivers: NewDriver[] = [];

        for (const [key, value] of Object.entries(drivers)) {
          newDrivers.push({
            racingNumber: parseInt(value.RacingNumber),
            abbreviation: value.Tla,
            teamColor: value.TeamColour,
          });
        }

        const offset =
          session.GmtOffset[0] !== "-"
            ? (session.GmtOffset = "+" + session.GmtOffset.slice(0, -3))
            : (session.GmtOffset = session.GmtOffset.slice(0, -3));

        const newSession: NewSession = {
          name: session.Meeting.Name,
          officialName: session.Meeting.OfficialName,
          location: session.Meeting.Location,
          meetingKey: session.Meeting.Key,
          sessionKey: session.Key,
          type: session.Name,
          startDate: new Date(session.StartDate + offset),
          endDate: new Date(session.EndDate + offset),
          gmtOffset: offset,
          country: {
            code: session.Meeting.Country.Code,
            name: session.Meeting.Country.Name,
          },
          drivers: newDrivers,
        };

        try {
          const database = client.db("f1dashboard");
          const collection = database.collection("sessions");
          const result = await collection.insertOne(newSession);
          console.log(
            `A document was inserted with the _id: ${result.insertedId}`
          );
        } catch (error) {
          console.error(error);
          console.log(url);
        }
      }
    });
  });
}
main();
