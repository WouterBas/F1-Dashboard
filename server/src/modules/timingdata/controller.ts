import { Context } from "hono";
import client from "../../shared/dbConnection";

export const getTimingData = async (c: Context) => {
  const key: number = Number(c.req.param("key"));
  const minute: number = Number(c.req.query("minute"));
  const startTime: Date = new Date(c.req.query("starttime") as string);

  const result = await client
    .db("f1dashboard")
    .collection("timingdata")
    .find(
      {
        sessionKey: key,
        timestamp: {
          $gte: new Date(startTime.getTime() + 1000 * 60 * minute),
          $lt: new Date(startTime.getTime() + 1000 * 60 * (minute + 2)),
        },
      },
      {
        projection: { _id: 0, timestamp: 1, lines: 1 },
      }
    )
    .toArray();

  if (result.length === 0) {
    c.status(404);
    return c.json({ message: "Timingdata not found" });
  }
  return c.json(result);
};
