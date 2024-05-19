import client from "../shared/dbConnection";

import schedules from "./schedules.json";

async function seeder() {
  await client.connect();
  const result = await client
    .db("test")
    .collection("schedules")
    .insertMany(schedules);
  console.log(`${result.insertedCount} documents were inserted`);
  await client.close();
}

seeder()
  .then(() => {
    console.log("Seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Seeding error:", err);
    process.exit(1);
  });
