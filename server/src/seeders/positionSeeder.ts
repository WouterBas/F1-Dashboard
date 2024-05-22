import client from "../shared/dbConnection";
import { Entrie, Entry, F1Entries, F1Position, Meeting } from "../types";
import { getF1StreamData } from "./utils/fetchF1Data";
import zlib from "zlib";

import { getMeetings } from "./utils/helpers";

const meetings = await getMeetings();

async function seeder() {
  await client.connect();

  console.log("fetching positions...");
  for (const { url, name, sessionKey, type, startDate } of meetings) {
    const positions = await getF1StreamData(url, "Position.z");
    const positionsArr: string[] = positions
      .split("\n")
      .map((str) => str.substring(13, str.length - 2));

    const decodedPositions = decode(positionsArr);
    const convertedPositions = convertPosition(decodedPositions, sessionKey);

    if (!convertedPositions.length) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - no positions were inserted`
      );
      continue;
    } else {
      const result = await client
        .db("temp")
        .collection("positions")
        .insertMany(convertedPositions);

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
    timestamp: position.Timestamp,
    entries: convertEntries(position.Entries),
    sessionKey,
  }));
}

function convertEntries(entries: F1Entries): Entrie {
  const convertedEntries: Entrie = {};
  Object.keys(entries).forEach((key) => {
    convertedEntries[key] = {
      X: entries[key].X,
      Y: entries[key].Y,
    };
  });
  return convertedEntries;
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
