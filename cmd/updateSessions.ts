import { client } from "../server/src/db";

async function getCircuits() {
  const circuits = await client
    .db("f1dashboard")
    .collection("circuits")
    .find({})
    .toArray();
  return circuits;
}

async function run() {
  const circuits = await getCircuits();
  circuits.forEach(async (circuitInfo) => {
    try {
      const database = client.db("f1dashboard");
      const movies = database.collection("sessions");
      /* Update a document that has the title "Random Harvest" to have a
        plot field with the specified value */
      const result = await movies.updateMany(
        { location: circuitInfo.name },
        {
          $set: {
            circuit: circuitInfo._id,
          },
        },
        /* Set the upsert option to insert a document if no documents
          match the filter */
        { upsert: false }
      );
      // Print the number of matching and modified documents
      console.log(`Updated ${result.modifiedCount} documents`);
    } catch (e) {
      console.error(e);
    }
  });
}
// Run the program and print any thrown errors
run().catch(console.dir);
