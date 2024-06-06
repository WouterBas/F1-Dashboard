import client from "../shared/dbConnection";
import { getF1StreamData } from "./utils/fetchF1Data";
import type { TimingData } from "../types";

import { getMeetings } from "./utils/helpers";

const [meetings] = await getMeetings();

async function seeder() {
  await client.connect();

  const timingData = await getF1StreamData(meetings.url, "TimingDataF1");
  const timingDataArr: TimingData[] = timingData
    .split("\n")
    .map((str: string) => str.substring(12))
    .slice(0, -1)
    .map((str: string) => JSON.parse(str).Lines);

  console.log(timingDataArr[0]);

  // const convertedTimingData = timingDataArr.map((timingData: TimingData) => {
  //   return {
  //     timestamp: new Date(),
  //     sessionKey: meetings.sessionKey,
  //     entries: timingData.Lines,
  //   };
  // });

  // const result = await client
  //   .db("f1dashboard")
  //   .collection("timingdata")
  //   .insertMany(convertedTimingData);

  // console.log(`${result.insertedCount} timingdata were inserted`);

  await client.close();
}

seeder()
  .then(() => {
    console.log("Position seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Position seeding error:", err);
    process.exit(1);
  });
