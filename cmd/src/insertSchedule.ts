import type { schedule } from "./types";
import { MongoClient } from "mongodb";
// import { client } from "./db";
// const years = ["2023", "2022", "2021"];
const years = ["2024"];

async function main(y: string) {
  const response = await fetch(`https://ergast.com/api/f1/${y}.json`);
  const data = await response.json();

  const schedule: schedule[] = data.MRData.RaceTable.Races;
  const sessions = schedule.map((session) => {
    return {
      name: session.raceName,
      year: session.season,
      date: session.date,
      sessions: [
        { Practice_1: session.FirstPractice.date },
        session.ThirdPractice || y === "2022" || y === "2021"
          ? { Practice_2: session.SecondPractice.date }
          : { Sprint_Shootout: session.SecondPractice.date },
        session.ThirdPractice
          ? { Practice_3: session.ThirdPractice.date }
          : { Sprint: session.Sprint?.date },
        { Qualifying: session.Qualifying.date },
        { Race: session.date },
      ],
    };
  });

  const uri = "mongodb://root:123456@localhost:27017/";
  const client = new MongoClient(uri);

  try {
    const database = client.db("temp");
    const collection = database.collection("schedules");
    const result = await collection.insertMany(sessions);
    console.log(`${result.insertedCount} documents were inserted`);
  } finally {
    await client.close();
  }
}

years.forEach((year) => main(year));
