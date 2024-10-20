import client from "../shared/dbConnection";
import { getF1StreamData } from "./utils/fetchF1Data";
import type { Tirestints, RawTireStintObject } from "../types";
import { findTimeOffset } from "./utils/helpers";

import { getMeetings } from "./utils/helpers";

const meetings = await getMeetings();

async function seeder() {
  await client.connect();

  await client
    .db("f1dashboard")
    .collection("tirestints")
    .createIndexes([{ key: { sessionKey: 1 } }, { key: { timestamp: 1 } }]);

  // check if timing data already exists in database
  console.log("fetching tire stints...");

  for (const { url, name, sessionKey, type, startDate } of meetings) {
    const existInDb = await client
      .db("f1dashboard")
      .collection("tirestints")
      .findOne({ sessionKey: sessionKey });
    if (existInDb) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - tire stints already exists`
      );
      continue;
    }

    // fetch timing data from f1
    const rawTireStints = await getF1StreamData(url, "TyreStintSeries");
    if (!rawTireStints) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - no tire stints was found`
      );
      continue;
    }

    const parsedTireStints: [RawTireStintObject, string][] = rawTireStints
      .split("\n")
      .map((str: string) => [str.substring(12), str.substring(0, 12)])
      .slice(0, -1)
      .map((str: string[]) => [JSON.parse(str[0]).Stints, str[1]]);

    const { timeOffset, startTime } = await findTimeOffset(url);

    const tireStintsNotEmpty = removeEmpty(parsedTireStints);

    const tireStintsArray = convertData(
      tireStintsNotEmpty,
      timeOffset,
      startTime,
      sessionKey
    );
    const tireStintsExtended = extendData(tireStintsArray);

    if (tireStintsExtended.length === 0) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - no tire stints was found`
      );
      continue;
      // insert timing data into database
    } else {
      const result = await client
        .db("f1dashboard")
        .collection("tirestints")
        .insertMany(tireStintsExtended);

      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - #${
          result.insertedCount
        } tire stints were inserted`
      );
    }
  }

  await client.close();
}

function removeEmpty(data: [RawTireStintObject, string][]) {
  return data.filter((line) => Object.keys(line[0]).length != 0);
}

function convertData(
  rawTireStints: [RawTireStintObject, string][],
  timeOffset: number,
  startTime: Date,
  sessionKey: number
): Tirestints[] {
  return rawTireStints.map((line) => {
    const newTimestamp =
      new Date(
        startTime.toISOString().split("T")[0] + "T" + line[1]
      ).getTime() - timeOffset;

    return {
      timestamp: new Date(newTimestamp),
      sessionKey: sessionKey,
      lines: convertLines(line[0]),
    };
  });
}

function convertLines(line: RawTireStintObject) {
  return Object.keys(line).map((key) => {
    const pitStops = Object.keys(line[key])[0];
    return {
      driverNumber: parseInt(key),
      compound: line[key][pitStops]?.Compound?.toLowerCase(),
      age: line[key][pitStops]?.TotalLaps,
      pitStops: parseInt(pitStops),
    };
  });
}

function extendData(tireStints: Tirestints[]) {
  const newTireStints: Tirestints[] = [];
  tireStints.forEach((data, i) => {
    const previousLines = newTireStints[i - 1]?.lines;
    newTireStints.push({
      ...data,
      lines: extendLines(data.lines, previousLines),
    });
  });

  return newTireStints;
}

function extendLines(
  currentLines: Tirestints["lines"],
  previousLines: Tirestints["lines"]
) {
  if (!previousLines) return currentLines;

  return previousLines.map((pr) => {
    const cu = currentLines.find((c) => c.driverNumber === pr.driverNumber);

    const extendedDriverData = {
      driverNumber: pr.driverNumber,
      compound: cu?.compound === undefined ? pr.compound : cu.compound,
      age: cu?.age === undefined ? pr.age : cu.age,
      pitStops: cu?.pitStops === undefined ? pr.pitStops : cu.pitStops,
    };
    return extendedDriverData;
  });
}

seeder()
  .then(() => {
    console.log("tire stints seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("tire stints seeding error:", err);
    process.exit(1);
  });
