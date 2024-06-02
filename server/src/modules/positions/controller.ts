import { Context } from "hono";
import client from "../../shared/dbConnection";

import { Position } from "../../types";

export const getPositionByMinute = async (c: Context) => {
  const key: number = Number(c.req.param("key"));
  const minute: number = Number(c.req.query("minute"));
  const startTime: Date = new Date(c.req.query("starttime") as string);

  console.log(key, minute, startTime);

  const result = await client
    .db("f1dashboard")
    .collection("positions")
    .find(
      {
        sessionKey: key,
        timestamp: {
          $gte: new Date(startTime.getTime() + 1000 * 60 * minute),
          $lt: new Date(startTime.getTime() + 1000 * 60 * (minute + 1)),
        },
      },
      { projection: { _id: 0, timestamp: 1, entries: 1 } }
    )
    .toArray();
  return c.json(result);
};

export const getPositionOneDriver = async (c: Context) => {
  const key: number = Number(c.req.param("key"));
  const driverNumber: string = c.req.param("driver");
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

  const filterDriver = result.map((position) => ({
    x: position.entries[driverNumber].X,
    y: position.entries[driverNumber].Y,
  }));

  return c.json(filterDriver);
};
