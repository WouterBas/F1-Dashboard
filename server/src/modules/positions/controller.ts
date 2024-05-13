import { Context } from "hono";
import client from "../../shared/dbConnection";

import { Position } from "../../types";
import { WithId } from "mongodb";

export const getPositionByKey = async (c: Context) => {
  const key: number = Number(c.req.param("key"));
  const timestamp: Date = new Date(c.req.query("time") as string);

  const result = await client
    .db("f1dashboard")
    .collection("positions")
    .find({
      sessionKey: key,
      timestamp: {
        $gte: timestamp,
        $lt: new Date(timestamp.getTime() + 1000 * 60),
      },
    })
    .toArray();
  return c.json(result);
};

export const getPositionOneDriver = async (c: Context) => {
  const key: number = Number(c.req.param("key"));
  const driverNumber: string = c.req.param("driver");
  const starttime: Date = new Date(c.req.query("starttime") as string);
  const duration = Number(c.req.query("duration"));

  console.log(duration);

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
