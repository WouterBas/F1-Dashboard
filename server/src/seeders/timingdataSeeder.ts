import client from "../shared/dbConnection";
import { getF1StreamData } from "./utils/fetchF1Data";
import type { TimingData, RawTimingDataObject, DriverClean } from "../types";
import { findTimeOffset } from "./utils/helpers";

import { getMeetings } from "./utils/helpers";

const meetings = await getMeetings();

async function seeder() {
  await client.connect();

  await client
    .db("f1dashboard")
    .collection("timingdata")
    .createIndexes([{ key: { sessionKey: 1 } }, { key: { timestamp: 1 } }]);

  // check if timing data already exists in database
  console.log("fetching timing data...");
  for (const { url, name, sessionKey, type, startDate } of meetings) {
    const existInDb = await client
      .db("f1dashboard")
      .collection("timingdata")
      .findOne({ sessionKey: sessionKey });
    if (existInDb) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - timing data already exists`
      );
      continue;
    }

    // fetch timing data from f1
    const timingData = await getF1StreamData(url, "TimingData");
    if (!timingData) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - no timing data was found`
      );
      continue;
    }
    // parse raw timing data to json
    const timingDataParsed: [RawTimingDataObject, string][] = timingData
      .split("\n")
      .map((str: string) => [str.substring(12), str.substring(0, 12)])
      .slice(0, -1)
      .map((str: string[]) => [JSON.parse(str[0]).Lines, str[1]]);

    const { timeOffset, startTime } = await findTimeOffset(url);

    const timingDataArray = convertData(
      timingDataParsed,
      timeOffset,
      startTime,
      sessionKey
    );

    const timingDataFiltered = filterTimingData(timingDataArray);
    const timingDataExtended = extendTimingData(
      timingDataFiltered,
      startTime,
      type
    );

    if (timingDataExtended.length === 0) {
      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - no timing data was found`
      );
      continue;
      // insert timing data into database
    } else {
      const result = await client
        .db("f1dashboard")
        .collection("timingdata")
        .insertMany(timingDataExtended);

      console.log(
        `${startDate.getFullYear()} - ${name} - ${type} - #${
          result.insertedCount
        } timingdata were inserted`
      );
    }
  }

  await client.close();
}

// convert data from object to array
function convertData(
  data: [RawTimingDataObject, string][],
  timeOffset: number,
  startTime: Date,
  sessionKey: number
): TimingData[] {
  const cleanData = data.filter((line) => {
    return line[0] !== undefined;
  });
  const convertedData: [DriverClean[], string][] = cleanData.map((line) => {
    const driverData = line[0];
    const convertedDrivers: DriverClean[] = Object.keys(line[0]).map((key) => {
      return {
        driverNumber: parseInt(key),
        position: driverData[key].Position
          ? parseInt(driverData[key].Position)
          : undefined,
        retired: driverData[key].Retired,
        inPit: driverData[key].InPit,
        pitOut: driverData[key].PitOut,
        stopped: driverData[key].Stopped,
        interval: driverData[key].IntervalToPositionAhead?.Value,
      };
    });
    return [convertedDrivers, line[1]];
  });

  const convertedTimingData: TimingData[] = convertedData.map((data) => {
    const newTimestamp =
      new Date(
        startTime.toISOString().split("T")[0] + "T" + data[1]
      ).getTime() - timeOffset;

    return {
      timestamp: new Date(newTimestamp),
      sessionKey: sessionKey,
      lines: data[0],
    };
  });
  return convertedTimingData;
}

// filter out all the data that has no useful data
function filterTimingData(timingData: TimingData[]): TimingData[] {
  return timingData.filter((data) => {
    return data.lines.some(
      (driver) =>
        driver.position ||
        driver.retired ||
        driver.inPit ||
        driver.pitOut ||
        driver.stopped ||
        driver.interval
    );
  });
}

function extendTimingData(
  timingData: TimingData[],
  startTime: Date,
  type: String
): TimingData[] {
  const newTimingData: TimingData[] = [];
  timingData.forEach((data, i) => {
    const previousLines = newTimingData[i - 1]?.lines;
    newTimingData.push({
      ...data,
      lines: extendLines(
        data.lines,
        previousLines,
        data.timestamp,
        startTime,
        type
      ),
    });
  });

  return newTimingData;
}

function extendLines(
  currentLines: DriverClean[],
  previousLines: DriverClean[],
  timestamp: Date,
  startTime: Date,
  type: String
): DriverClean[] {
  if (!previousLines)
    return currentLines.map((line) =>
      type === "Sprint" ? { ...line, inPit: false } : line
    );

  return previousLines.map((pr) => {
    const cu = currentLines.find((c) => c.driverNumber === pr.driverNumber);

    const extendedDriverData = {
      driverNumber: pr.driverNumber,
      position: cu?.position === undefined ? pr.position : cu.position,
      retired: cu?.retired === undefined ? pr.retired : cu.retired,
      inPit: cu?.inPit === undefined ? pr.inPit : cu.inPit,
      pitOut: cu?.pitOut === undefined ? pr.pitOut : cu.pitOut,
      stopped: cu?.stopped === undefined ? pr.stopped : cu.stopped,
      interval: cu?.interval === undefined ? pr.interval : cu.interval,
    };
    if ((type === "Race" || type === "Sprint") && timestamp < startTime) {
      return {
        ...extendedDriverData,
        inPit: false,
      };
    }
    return extendedDriverData;
  });
}

seeder()
  .then(() => {
    console.log("timing data seeding completed");
  })
  .catch((err) => {
    console.error("timing data seeding error:", err);
    process.exit(1);
  });
