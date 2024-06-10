import client from "../shared/dbConnection";

async function seeder() {
  await client.connect();

  const result = await client
    .db("f1dashboard")
    .collection("seeding")
    .updateOne(
      { lastSeedingDate: { $exists: true } },
      {
        $set: {
          lastSeedingDate: new Date(),
        },
      }
    );

  console.log(`${result.modifiedCount} documents were updated`);

  await client.close();
}

seeder()
  .then(() => {
    console.log("Save last seeding date completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Save last seeding date error:", err);
    process.exit(1);
  });
