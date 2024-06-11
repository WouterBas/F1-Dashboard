import client from "../shared/dbConnection";

async function seeder() {
  await client.connect();
  console.log("inserting users...");

  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env");
  }
  const user = {
    username: process.env.ADMIN_USERNAME,
    password: await Bun.password.hash(process.env.ADMIN_PASSWORD),
  };

  const existInDb = await client
    .db("f1dashboard")
    .collection("users")
    .findOne({ username: user.username });
  if (existInDb) {
    console.log("User already exists");
    await client.close();
    return;
  }

  const result = await client
    .db("f1dashboard")
    .collection("users")
    .insertOne(user);
  console.log(result.acknowledged ? "User inserted" : "User not inserted");
  await client.close();
}

seeder()
  .then(() => {
    console.log("User seeding completed");
  })
  .catch((err) => {
    console.error("User seeding error:", err);
    process.exit(1);
  });
