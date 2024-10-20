import client from "../../shared/dbConnection";
import { Meeting } from "../../types";
import { getF1StreamData } from "./fetchF1Data";

// get schedule from database
export const getMeetings = async () => {
  const result = (await client
    .db("f1dashboard")
    .collection("sessions")
    .find({})
    .sort({ startDate: 1 })
    .toArray()) as unknown as Meeting[];
  console.log("fetching sessions...");
  return result;
};

// get schedule from database where there are no drivers
export const getMeetingsWithoutDrivers = async () => {
  const result = (await client
    .db("f1dashboard")
    .collection("sessions")
    .find({
      drivers: { $exists: false },
    })
    .toArray()) as unknown as Meeting[];
  console.log("fetching sessions...");
  return result;
};

export async function findTimeOffset(
  url: string
): Promise<{ timeOffset: number; startTime: Date }> {
  const sessionData = await getF1StreamData(url, "SessionData");
  if (!sessionData) {
    return {
      timeOffset: 0,
      startTime: new Date(),
    };
  }
  const sessionDataArr: string[][] = sessionData
    .split("\n")
    .map((str: string) => [str.substring(0, 12), str.substring(12)])
    .slice(0, -1);

  // find the index of the sessionDataArr that has "Started" in the StatusSeries
  const startIndex = sessionDataArr.findIndex((arr) => {
    return arr[1].includes("Started");
  });

  if (startIndex === -1) {
    return {
      timeOffset: 0,
      startTime: new Date(),
    };
  }

  // find the time offset
  const indexOfUtc = sessionDataArr[startIndex][1].indexOf("Utc");
  const startTime = new Date(
    sessionDataArr[startIndex][1]
      .slice(indexOfUtc + 6, indexOfUtc + 32)
      .split('"')[0]
  );
  const streamTime = new Date(
    startTime.toISOString().split("T")[0] + "T" + sessionDataArr[startIndex][0]
  );
  const diff = streamTime.getTime() - startTime.getTime();
  return {
    timeOffset: diff,
    startTime: startTime,
  };
}
