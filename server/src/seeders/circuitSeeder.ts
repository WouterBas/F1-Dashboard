import client from "../shared/dbConnection";
// import { getMeetings } from "./utils/helpers";

// const meetings = await getMeetings();

import circuits from "./circuits.json";

// const uniqueCircuits = [
//   ...new Map(
//     meetings.map((meeting) => [meeting["circuitKey"], meeting])
//   ).values(),
// ];
// const convertCircuit = uniqueCircuits.map((circuit) => {
//   const index = circuits.findIndex((c) => c.circuitKey === circuit.circuitKey);
//   if (index != -1) {
//     return {
//       ...circuits[index],
//     };
//   } else {
//     return {
//       name: circuit.circuitName,
//       circuitKey: circuit.circuitKey,
//     };
//   }
// });

async function seeder() {
  await client.connect();

  const circuitsDb = await client
    .db("f1dashboard")
    .collection("circuits")
    .find({})
    .toArray();

  const filteredCircuits = circuits.filter(
    (circuit) =>
      !circuitsDb.some(
        (dbCircuit) => dbCircuit.circuitKey === circuit.circuitKey
      )
  );

  if (filteredCircuits.length === 0) {
    console.log("No new circuits to insert");
  } else {
    const result = await client
      .db("f1dashboard")
      .collection("circuits")
      .insertMany(filteredCircuits);
    console.log(`${result.insertedCount} circuits were inserted`);
  }

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
