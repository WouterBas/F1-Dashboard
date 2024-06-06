import client from "../shared/dbConnection";
import { getF1StreamData } from "./utils/fetchF1Data";
import type { TimingData, Lines, ConvertedLines } from "../types";

import { getMeetings } from "./utils/helpers";
import { timeStamp } from "console";

const [meetings] = await getMeetings();

async function seeder() {
  await client.connect();

  const timingData = await getF1StreamData(meetings.url, "TimingDataF1");
  const LinesArr: Lines[] = timingData
    .split("\n")
    .map((str: string) => str.substring(12))
    .slice(0, -1)
    .map((str: string) => JSON.parse(str).Lines);

  const time = timingData.split("\n")[0].substring(0, 12);

  console.log(time);

  const filteredLines = filterUnusefulData(LinesArr);
  const convertedLines = filteredLines.map((line) => convertLines(line));
  const convertedTimingData: TimingData[] = [];

  convertedLines.forEach((line, index) => {
    const prevLines = convertedTimingData[index - 1]?.lines;
    convertedTimingData.push({
      timeStamp: new Date(),
      sessionKey: meetings.sessionKey,
      lines: extendLines(line, prevLines),
    });
  });

  const result = await client
    .db("f1dashboard")
    .collection("timingdata")
    .insertMany(convertedTimingData);

  console.log(`${result.insertedCount} timingdata were inserted`);

  await client.close();
}

// filter out lines that don't contain position, retired, inPit, pitOut or stopped
function filterUnusefulData(data: Lines[]): Lines[] {
  return data.filter((line) => {
    const keys = Object.keys(line);
    return keys.some((key) => {
      return (
        line[key].InPit ||
        line[key].PitOut ||
        line[key].Retired ||
        line[key].Position
      );
    });
  });
}

// convert lines to new format and remove useless data such as sectors, number of laps, status,...
function convertLines(line: Lines): ConvertedLines {
  const convertedLines: ConvertedLines = {};
  Object.keys(line).forEach((key) => {
    convertedLines[key] = {
      inPit: line[key].InPit,
      pitOut: line[key].PitOut,
      retired: line[key].Retired,
      position: Number(line[key].Position),
    };
  });
  return convertedLines;
}

// extend lines with previous lines if they exist
function extendLines(line: ConvertedLines, previousLine: ConvertedLines) {
  if (!previousLine) return line;

  const newLines: ConvertedLines = {};
  Object.keys(previousLine).forEach((key) => {
    newLines[key] = {
      inPit:
        line[key]?.inPit === undefined
          ? previousLine[key].inPit
          : line[key].inPit,
      pitOut:
        line[key]?.pitOut === undefined
          ? previousLine[key].pitOut
          : line[key].pitOut,
      retired:
        line[key]?.retired === undefined
          ? previousLine[key].retired
          : line[key].retired,
      position:
        line[key]?.position === undefined || !line[key].position
          ? previousLine[key].position
          : line[key].position,
    };
  });
  return newLines;
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
