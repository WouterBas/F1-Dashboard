import client from "../shared/dbConnection";
import { Schedule } from "../types";

import schedules from "./schedules.json";

async function getSchedule() {
  const schedule = (await client
    .db("f1dashboard")
    .collection("schedules")
    .find({})
    .toArray()) as Schedule[];
  return schedule;
}

async function seeder() {
  await client.connect();
  console.log("inserting schedule...");

  const dbSchedules = await getSchedule();
  const filteredSchedules = schedules.filter(
    (schedule) =>
      !dbSchedules.some((dbSchedule) => dbSchedule.date === schedule.date)
  );

  if (filteredSchedules.length === 0) {
    console.log("No new schedules to insert");
  } else {
    const result = await client
      .db("f1dashboard")
      .collection("schedules")
      .insertMany(filteredSchedules);
    console.log(`${result.insertedCount} documents were inserted`);
  }
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
