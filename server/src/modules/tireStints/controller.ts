import { Context } from "hono";
import client from "../../shared/dbConnection";

export const getTireStints = async (c: Context) => {
  const key: number = Number(c.req.param("key"));

  const result = await client
    .db("f1dashboard")
    .collection("tirestints")
    .find(
      {
        sessionKey: key,
      },
      {
        projection: { _id: 0, timestamp: 1, lines: 1 },
      }
    )

    .toArray();

  if (result.length === 0) {
    c.status(404);
    return c.json({ message: "Tire stints not found" });
  }
  return c.json(result);
};
