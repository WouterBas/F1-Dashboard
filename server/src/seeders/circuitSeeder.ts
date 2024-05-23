import client from "../shared/dbConnection";
import { Meeting } from "../types";
import { getMeetings } from "./utils/helpers";

const meetings = await getMeetings();

import circuits from "./circuits.json";

const uniqueCircuits = [
  ...new Map(
    meetings.map((meeting) => [meeting["circuitKey"], meeting])
  ).values(),
];
const convertCircuit = uniqueCircuits.map((circuit) => {
  const index = circuits.findIndex((c) => c.circuitKey === circuit.circuitKey);
  if (index != -1) {
    return {
      ...circuits[index],
    };
  } else {
    return {
      name: circuit.circuitName,
      circuitKey: circuit.circuitKey,
    };
  }
});

async function seeder() {
  await client.connect();
  const result = await client
    .db("f1dashboard")
    .collection("circuits")
    .insertMany(convertCircuit);
  console.log(`${result.insertedCount} circuits were inserted`);

  await client.close();
}

seeder()
  .then(() => {
    console.log("Circuit seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Circuit seeding error:", err);
    process.exit(1);
  });
