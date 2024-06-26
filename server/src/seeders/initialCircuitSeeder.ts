import client from "../shared/dbConnection";
import { getMeetings } from "./utils/helpers";

const meetings = await getMeetings();

const uniqueCircuits = [
  ...new Map(
    meetings.map((meeting) => [meeting["circuitKey"], meeting])
  ).values(),
];

const convertCircuit = uniqueCircuits.map((circuit) => {
  return {
    name: circuit.circuitName,
    circuitKey: circuit.circuitKey,
  };
});

async function seeder() {
  await client.connect();

  const result = await client
    .db("f1dashboard")
    .collection("circuits")
    .insertMany(convertCircuit);
  console.log(`${result.insertedCount} circuits were inserted`);

  await client
    .db("f1dashboard")
    .collection("circuits")
    .createIndex({ circuitKey: 1 });

  await client.close();
}

seeder()
  .then(() => {
    console.log("Circuit seeding completed");
  })
  .catch((err) => {
    console.error("Circuit seeding error:", err);
    process.exit(1);
  });
