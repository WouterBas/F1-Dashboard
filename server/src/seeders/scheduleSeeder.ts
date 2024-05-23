import client from "../shared/dbConnection";

import schedules from "./schedules.json";

async function seeder() {
  await client.connect();
  console.log("inserting schedule...");
  const result = await client
    .db("f1dashboard")
    .collection("schedules")
    .insertMany(schedules);
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
