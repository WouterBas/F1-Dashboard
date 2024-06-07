import client from "../shared/dbConnection";
import { getF1StreamData } from "./utils/fetchF1Data";
import type { TimingData, Lines, ConvertedLines, SessionData } from "../types";

import { getMeetings } from "./utils/helpers";
import { timeStamp } from "console";
import { listeners } from "process";

const meetings = await getMeetings();

async function seeder() {
  await client.connect();

  console.log("fetching timing data...");
  for (const { url, name, sessionKey, type, startDate, endDate } of meetings) {
    const timingData = await getF1StreamData(url, "TimingDataF1");
    const LinesArr: [Lines, string][] = timingData
      .split("\n")
      .map((str: string) => [str.substring(12), str.substring(0, 12)])
      .slice(0, -1)
      .map((str: string[]) => [JSON.parse(str[0]).Lines, str[1]]);

    const { timeOffset, startTime } = await findTimeOffset(url);

    const filteredLines = filterUnusefulData(LinesArr);
    const convertedLines = filteredLines.map((line) => convertLines(line));

    const convertedTimingData: TimingData[] = [];
    convertedLines.forEach((line, index) => {
      const prevLines = convertedTimingData[index - 1]?.lines;
      const timeStamp =
        new Date(
          startTime.toISOString().split("T")[0] + "T" + line[1]
        ).getTime() - timeOffset;
      convertedTimingData.push({
        timeStamp: new Date(timeStamp),
        sessionKey,
        lines: extendLines(line[0], prevLines),
      });
    });

    const result = await client
      .db("f1dashboard")
      .collection("timingdata")
      .insertMany(convertedTimingData);

    console.log(
      `${startDate.getFullYear()} - ${name} - ${type} - #${
        result.insertedCount
      } timingdata were inserted`
    );
  }

  await client.close();
}

// filter out lines that don't contain position, retired, inPit, pitOut or stopped
function filterUnusefulData(data: [Lines, string][]): [Lines, string][] {
  const filteredData = data.filter((line: [Lines, string]) => {
    if (!line[0]) return false;
    const keys = Object.keys(line[0]);
    return keys.some((key) => {
      return (
        line[0][key].InPit ||
        line[0][key].PitOut ||
        line[0][key].Retired ||
        line[0][key].Position
      );
    });
  });

  return filteredData;
}

// convert lines to new format and remove useless data such as sectors, number of laps, status,...
function convertLines(line: [Lines, string]): [ConvertedLines, string] {
  const convertedLines: [ConvertedLines, string] = [{}, line[1]];
  Object.keys(line[0]).forEach((key) => {
    convertedLines[0][key] = {
      inPit: line[0][key].InPit,
      pitOut: line[0][key].PitOut,
      retired: line[0][key].Retired,
      position: Number(line[0][key].Position),
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

async function findTimeOffset(url: string) {
  const sessionData = await getF1StreamData(url, "SessionData");
  const sessionDataArr: string[][] = sessionData
    .split("\n")
    .map((str: string) => [str.substring(0, 12), str.substring(12)])
    .slice(0, -1);

  // find the index of the sessionDataArr that has "Started" in the StatusSeries
  const startIndex = sessionDataArr.findIndex((arr) => {
    return arr[1].includes("Started");
  });

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

seeder()
  .then(() => {
    console.log("Position seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Position seeding error:", err);
    process.exit(1);
  });
