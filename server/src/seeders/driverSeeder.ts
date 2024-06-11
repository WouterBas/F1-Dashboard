import client from "../shared/dbConnection";
import { F1Driver, F1DriverObject } from "../types";
import { getF1DataWithUrl } from "./utils/fetchF1Data";
import { getMeetingsWithoutDrivers } from "./utils/helpers";

const meetings = await getMeetingsWithoutDrivers();

async function seeder() {
  await client.connect();

  // fetch driver list
  console.log("fetching driver list...");

  for (const { url, sessionKey, name, startDate, type } of meetings) {
    const drivers = (await getF1DataWithUrl(
      url,
      "DriverList"
    )) as F1DriverObject;
    const driverList = Object.values(drivers).map((driver) =>
      convertData(driver)
    );

    const result = await client
      .db("f1dashboard")
      .collection("sessions")
      .updateOne({ sessionKey }, { $set: { drivers: driverList } });

    console.log(
      `${startDate.getFullYear()} - ${name} - ${type} - ${
        !!result.modifiedCount
          ? "drivers were modified"
          : "drivers were not modified"
      }`
    );
  }

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
  })
  .catch((err) => {
    console.error("Driver seeding error:", err);
    process.exit(1);
  });
