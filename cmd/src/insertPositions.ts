import { client } from "./dbConnection";
import zlib from "zlib";
import type { Entrie, Session_ } from "./types";

async function getSchedule() {
  console.log("Fetching schedule...");
  const schedule = await client
    .db("f1dashboard")
    .collection("schedules")
    .find({ year: "2024" })
    .toArray();
  return schedule;
}
const toDb: object[] = [];

async function storeCircuits() {
  console.log("toDb length " + toDb.length);
  console.log("Storing circuits...");
  try {
    const database = client.db("f1dashboard");
    const collection = database.collection("positions");
    const result = await collection.insertMany(await toDb);
    console.log(`${result.insertedCount} documents were inserted`);
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  const schedule = await getSchedule();
  console.log("Fetching sessions...");
  schedule.forEach(async (sh) => {
    sh.sessions.forEach(async (s: object) => {
      for (const [key, value] of Object.entries(s)) {
        const url = `https://livetiming.formula1.com/static/${sh.year}/${
          sh.sessions[4].Race
        }_${sh.name.replaceAll(" ", "_")}/${value}_${key}/`;

        const sessionFetch = await fetch(`${url}SessionInfo.json`);
        if (sessionFetch.status === 404) {
          console.log(`${url}Index.json`);
          continue;
        }
        const session: Session_ = await sessionFetch.json();
        const respone = await fetch(`${url}Position.z.jsonStream`);
        const data = await respone.text();

        const clean: string[] = data
          .split("\n")
          .map((str) => str.substring(13, str.length - 2));

        clean.pop();
        // console.log("fetch length " + clean.length);

        clean.forEach(async (s) => {
          const decodedData = Buffer.from(s, "base64");
          // Decompress using deflate
          const decompressedData = zlib.inflateRawSync(decodedData);
          if (!decompressedData) throw new Error("Decompressed data is null");
          const jsonData = JSON.parse(decompressedData.toString("utf-8"));
          const positions = jsonData.Position;
          const newPositions = positions.map(
            (p: { Timestamp: number; Entries: Entrie[] }) => ({
              timestamp: new Date(p.Timestamp),
              entries: p.Entries,
              sessionKey: session.Key,
            })
          );
          newPositions.forEach((p: object) => {
            toDb.push(p);
          });
        });
      }
    });
  });
  setTimeout(storeCircuits, 6000);
}

main();
