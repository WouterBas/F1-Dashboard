import { Context } from "hono";
import client from "../../shared/dbConnection";

export const getLapCount = async (c: Context) => {
  const key: number = Number(c.req.param("key"));

  const result = await client
    .db("f1dashboard")
    .collection("lapcount")
    .findOne(
      {
        sessionKey: key,
      },
      {
        projection: { _id: 0, laps: 1 },
      }
    );

  if (result === null) {
    c.status(404);
    return c.json({ message: "Lapcount not found" });
  }
  return c.json(result.laps);
};
