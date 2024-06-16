import { Context } from "hono";
import client from "../../shared/dbConnection";

export const getTrackstatusByKey = async (c: Context) => {
  const key: number = Number(c.req.param("key"));

  const result = await client
    .db("f1dashboard")
    .collection("trackstatus")
    .find(
      {
        sessionKey: key,
      },
      {
        projection: { _id: 0, timestamp: 1, status: 1 },
      }
    )

    .toArray();
  return c.json(result);
};
