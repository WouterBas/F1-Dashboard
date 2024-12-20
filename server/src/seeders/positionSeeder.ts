import client from "../shared/dbConnection";
import { Entrie, F1Entries, F1Position, Position } from "../types";
import { getF1StreamData } from "./utils/fetchF1Data";
import zlib from "zlib";

import { getMeetings } from "./utils/helpers";

const meetings = await getMeetings();

async function seeder() {
  await client.connect();

  await client
    .db("f1dashboard")
    .collection("positions")
    .createIndex({ sessionKey: 1, timestamp: 1 });

  console.log("fetching positions...");
  for (const { url, name, sessionKey, type, startDate, endDate } of meetings) {
    const existInDb = await client
      .db("f1dashboard")
      .collection("positions")
      .findOne({ sessionKey: sessionKey });
    if (existInDb) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - positions already exists`
      );
      continue;
    }

    const positions = await getF1StreamData(url, "Position.z");
    if (!positions) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - positions not found`
      );
      continue;
    }
    const positionsArr: string[] = positions
      .split("\n")
      .map((str) => str.substring(13, str.length - 2));

    const decodedPositions = decode(positionsArr);
    const convertedPositions = convertPosition(decodedPositions, sessionKey);
    const noEmptyPositions = removeEmptyPositions(convertedPositions);
    const positionsBetween = removePostionsBetween(
      noEmptyPositions,
      startDate,
      endDate
    );

    if (!positionsBetween.length) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - no positions were inserted`
      );
      continue;
    } else {
      const result = await client
        .db("f1dashboard")
        .collection("positions")
        .insertMany(positionsBetween);

      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - #${
          result.insertedCount
        } positions were inserted`
      );
    }
  }

  await client.close();
}

function decode(positionsArr: string[]) {
  const decodedPositions: F1Position[] = [];
  positionsArr.slice(0, -1).forEach((str) => {
    const decodedData = Buffer.from(str, "base64");
    const decompressedData = zlib.inflateRawSync(decodedData);
    const jsonData = JSON.parse(decompressedData.toString("utf-8")).Position;
    jsonData.forEach((position: F1Position) => {
      decodedPositions.push(position);
    });
  });
  return decodedPositions;
}

function convertPosition(positions: F1Position[], sessionKey: number) {
  return positions.map((position: F1Position) => ({
    timestamp: new Date(position.Timestamp),
    entries: convertEntries(position.Entries),
    sessionKey,
  }));
}

function convertEntries(entries: F1Entries): Entrie[] {
  const convertedEntries = Object.keys(entries).map((key) => {
    return {
      driverNumber: parseInt(key),
      X: entries[key].X,
      Y: entries[key].Y,
    };
  });

  return convertedEntries;
}

function removeEmptyPositions(positions: Position[]) {
  return positions.filter((position) => {
    const entries = Object.values(position.entries);
    return entries.some((entry) => {
      return entry.X !== 0 && entry.Y !== 0;
    });
  });
}

function removePostionsBetween(
  positions: Position[],
  startDate: Date,
  endDate: Date
) {
  return positions.filter((position) => {
    const timestamp = new Date(position.timestamp);
    return timestamp >= startDate && timestamp <= endDate;
  });
}

seeder()
  .then(() => {
    console.log("Position seeding completed");
  })
  .catch((err) => {
    console.error("Position seeding error:", err);
    process.exit(1);
  });
