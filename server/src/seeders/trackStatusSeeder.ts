import client from "../shared/dbConnection";
import { SessionData } from "../types";
import { getF1DataWithUrl } from "./utils/fetchF1Data";
import { getMeetings } from "./utils/helpers";

const meetings = await getMeetings();

async function seeder() {
  await client.connect();

  await client
    .db("f1dashboard")
    .collection("trackstatus")
    .createIndexes([{ key: { sessionKey: 1 } }, { key: { timestamp: 1 } }]);

  console.log("fetching track status...");
  for (const { url, name, sessionKey, type, startDate } of meetings) {
    const existInDb = await client
      .db("f1dashboard")
      .collection("trackstatus")
      .findOne({ sessionKey: sessionKey });
    if (existInDb) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - trackstatus already exists`
      );
      continue;
    }

    const { StatusSeries } = (await getF1DataWithUrl(
      url,
      "SessionData"
    )) as SessionData;

    const convertedStatusSeries = StatusSeries.map((statusSery) => ({
      sessionKey: sessionKey,
      timestamp: new Date(statusSery.Utc),
      status: statusSery.TrackStatus || statusSery.SessionStatus,
    }));

    const filteredStatusSeries = convertedStatusSeries
      .filter((statusSery) => statusSery.timestamp >= startDate)
      .filter((statusSery) => {
        return (
          statusSery.status !== "Aborted" &&
          statusSery.status !== "Inactive" &&
          statusSery.status !== "Finalised" &&
          statusSery.status !== "Ends"
        );
      })
      .map((statusSery) => {
        if (statusSery.status === "Yellow")
          return {
            ...statusSery,
            status: "Yellow Flag",
          };
        if (statusSery.status === "Red")
          return {
            ...statusSery,
            status: "Red Flag",
          };
        if (statusSery.status === "VSCDeployed")
          return {
            ...statusSery,
            status: "VSC Deployed",
          };

        if (statusSery.status === "VSCEnding")
          return {
            ...statusSery,
            status: "VSC Ending",
          };

        if (statusSery.status === "SCDeployed")
          return {
            ...statusSery,
            status: "SC Deployed",
          };
        return statusSery;
      });

    const result = await client
      .db("f1dashboard")
      .collection("trackstatus")
      .insertMany(filteredStatusSeries);

    console.log(
      `${startDate.getFullYear()} - ${name} - ${type} - #${
        result.insertedCount
      } trackstatus were inserted`
    );
  }
  await client.close();
}

seeder()
  .then(() => {
    console.log("track status seeding completed");
  })
  .catch((err) => {
    console.error("track status seeding error:", err);
    process.exit(1);
  });
