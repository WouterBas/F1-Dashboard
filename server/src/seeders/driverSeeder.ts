import client from "../shared/dbConnection";
import { F1Driver, F1DriverObject } from "../types";
import { getF1DataWithUrl } from "./fetchF1Data";

// get schedule from database
const getMeetings = async () => {
  const result = await client
    .db("temp")
    .collection("sessions")
    .find()
    .toArray();
  return result;
};
console.log("fetching sessions...");
const meetings = await getMeetings();

async function seeder() {
  await client.connect();
  let count = 0;

  // fetch driver list
  console.log("fetching driver list...");
  await Promise.all(
    meetings.map(async (meeting) => {
      const drivers = (await getF1DataWithUrl(
        meeting.url,
        "DriverList"
      )) as F1DriverObject;
      const driverList = Object.values(drivers).map((driver) =>
        convertData(driver)
      );

      const result = await client
        .db("temp")
        .collection("sessions")
        .updateOne({ _id: meeting._id }, { $set: { drivers: driverList } })
        .then(() => {
          count++;
        });
    })
  );
  console.log(`${count} documents were modified`);
  await client.close();
}

function convertData(data: F1Driver) {
  return {
    racingNumber: parseInt(data.RacingNumber),
    abbreviation: data.Tla,
    teamColor: "#" + data.TeamColour,
  };
}

seeder()
  .then(() => {
    console.log("Driver seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Driver seeding error:", err);
    process.exit(1);
  });