import { Context } from "hono";
import client from "../../shared/dbConnection";

export const getTimingDataByMinute = async (c: Context) => {
  const key: number = Number(c.req.param("key"));
  const minute: number = Number(c.req.query("minute"));
  const startTime: Date = new Date(c.req.query("starttime") as string);

  const result = await client
    .db("f1dashboard")
    .collection("timingdata")
    .find(
      {
        sessionKey: key,
      },
      {
        projection: { _id: 0, timestamp: 1, lines: 1 },
      }
    )

    .toArray();
  return c.json(result);
};
