import { Context } from "hono";
import client from "../../shared/dbConnection";

import { Position } from "../../types";

export const getPositionByMinute = async (c: Context) => {
  const key: number = Number(c.req.param("key"));
  const minute: number = Number(c.req.query("minute"));
  const startTime: Date = new Date(c.req.query("starttime") as string);

  const result = await client
    .db("f1dashboard")
    .collection("positions")
    .find(
      {
        sessionKey: key,
        timestamp: {
          $gte: new Date(startTime.getTime() + 1000 * 60 * minute),
          $lt: new Date(startTime.getTime() + 1000 * 60 * (minute + 2)),
        },
      },
      { projection: { _id: 0, timestamp: 1, entries: 1 } }
    )
    .toArray();

  if (result.length === 0) {
    c.status(404);
    return c.json({ message: "Points not found" });
  }
  return c.json(result);
};

export const getPositionOneDriver = async (c: Context) => {
  const key: number = Number(c.req.param("key"));
  const driverNumber: number = Number(c.req.param("driver"));
  const starttime: Date = new Date(c.req.query("starttime") as string);
  const duration = Number(c.req.query("duration"));

  const result = (await client
    .db("f1dashboard")
    .collection("positions")
    .find({
      sessionKey: key,
      timestamp: {
        $gte: starttime,
        $lt: new Date(starttime.getTime() + duration),
      },
    })
    .toArray()) as unknown as Position[];

  if (result.length === 0) {
    c.status(404);
    return c.json({ message: "Points not found" });
  }

  const filteredResult = result.map((position) => {
    const entries = position.entries.filter((entry) => {
      return entry.driverNumber === driverNumber;
    });

    return entries.map((entry) => {
      return {
        x: entry.X,
        y: entry.Y,
      };
    })[0];
  });

  return c.json(filteredResult);
};
