import { client } from "../../server/src/db";

async function getLocations() {
  const schedule = await client
    .db("f1dashboard")
    .collection("sessions")
    .find({})
    .toArray();

  const uniqueLocations = [...new Set(schedule.map((s) => s.location))];
  return uniqueLocations.map((l) => ({ name: l }));
}

async function main() {
  const locations = await getLocations();
  try {
    const result = await client
      .db("f1dashboard")
      .collection("circuits")
      .insertMany(locations);
    console.log(`${result.insertedCount} documents were inserted`);
  } finally {
    client.close();
  }
}

main();
