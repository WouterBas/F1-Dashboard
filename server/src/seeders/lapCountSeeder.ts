import client from "../shared/dbConnection";
import { SessionData } from "../types";
import { getF1DataWithUrl } from "./utils/fetchF1Data";
import { getMeetings } from "./utils/helpers";

const meetings = await getMeetings();

async function seeder() {
  await client.connect();

  await client
    .db("f1dashboard")
    .collection("lapcount")
    .createIndexes([{ key: { sessionKey: 1 } }, { key: { timestamp: 1 } }]);

  console.log("fetching track status...");
  for (const { url, name, sessionKey, type, startDate } of meetings) {
    const existInDb = await client
      .db("f1dashboard")
      .collection("lapcount")
      .findOne({ sessionKey: sessionKey });
    if (existInDb) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - lapcount already exists`
      );
      continue;
    }

    // don't insert lapcount if it's not a race or qualifying session
    if (type.includes("Practice")) {
      continue;
    }

    const { Series } = (await getF1DataWithUrl(
      url,
      "SessionData"
    )) as SessionData;

    const lapCount = Series.map((series) => ({
      timestamp: new Date(series.Utc),
      lap: series.Lap || series.QualifyingPart,
    }));

    const lapCountSession = {
      sessionKey: sessionKey,
      laps: lapCount,
    };

    const result = await client
      .db("f1dashboard")
      .collection("lapcount")
      .insertOne(lapCountSession);

    console.log(
      `${startDate.getFullYear()} - ${name} - ${type} - ${
        result.acknowledged ? "lapcount were" : "lapcount were not"
      } inserted`
    );
  }
  await client.close();
}

seeder()
  .then(() => {
    console.log("lapcount seeding completed");
  })
  .catch((err) => {
    console.error("lapcount seeding error:", err);
    process.exit(1);
  });
