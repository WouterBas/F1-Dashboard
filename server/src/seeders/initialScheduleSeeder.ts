import client from "../shared/dbConnection";
import { Schedule, ScheduleApi } from "../types";
const years = ["2024"];

async function seeder() {
  await client.connect();

  const response = await fetch(`https://ergast.com/api/f1/${years[0]}.json`);
  const data: any = await response.json();

  const schedules: ScheduleApi[] = data.MRData.RaceTable.Races;

  const meetings: Schedule[] = [];
  schedules.forEach((session: any) => {
    console.log(session.raceName);
    const sessions = [];
    if (session.FirstPractice) {
      sessions.push({
        type: "Practice_1",
        date: session.FirstPractice.date,
      });
    }

    if (session.SecondPractice) {
      sessions.push({
        type: "Practice_2",
        date: session.SecondPractice.date,
      });
    }

    if (session.ThirdPractice) {
      sessions.push({
        type: "Practice_3",
        date: session.ThirdPractice.date,
      });
    }

    if (session.Sprint) {
      sessions.push({
        type: "Sprint",
        date: session.Sprint.date,
      });
    }

    if (session.Qualifying) {
      sessions.push({
        type: "Qualifying",
        date: session.Qualifying.date,
      });
    }

    sessions.push({
      type: "Race",
      date: session.date,
    });

    meetings.push({
      name: session.raceName,
      year: session.season,
      date: session.date,
      sessions,
    });
  });

  const result = await client
    .db("f1dashboard")
    .collection("schedules")
    .insertMany(meetings);
  console.log(`${result.insertedCount} documents were inserted`);

  await client.close();
}

seeder()
  .then(() => {
    console.log("Schedule seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Schedule seeding error:", err);
    process.exit(1);
  });
