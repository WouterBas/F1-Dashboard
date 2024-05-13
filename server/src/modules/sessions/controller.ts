import { Context } from "hono";
import client from "../../shared/dbConnection";

export const getAllSessions = async (c: Context) => {
  const result = await client
    .db("f1dashboard")
    .collection("sessions")
    .find(
      {},
      {
        projection: {
          name: 1,
          type: 1,
          sessionKey: 1,
          _id: 0,
          year: { $year: "$startDate" },
        },
      }
    )
    .sort({ startDate: -1 })
    .toArray();
  return c.json(result);
};

export const getSessionByKey = async (c: Context) => {
  const key: number = parseInt(c.req.param("key"));
  const result = await client
    .db("f1dashboard")
    .collection("sessions")
    .findOne({ sessionKey: key });
  return c.json(result);
};
