import { Context } from "hono";
import client from "../../shared/dbConnection";
import { start } from "repl";
import { Session } from "inspector";

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
          slug: 1,
          _id: 0,
          year: { $year: "$startDate" },
        },
      }
    )
    .sort({ startDate: -1 })
    .toArray();
  return c.json(result);
};

export const getSessionBySlug = async (c: Context) => {
  const name: string = c.req.param("name");
  const year: string = c.req.param("year");
  const type: string = c.req.param("type");
  const searchSlug = `${name}/${year}/${type}`;
  const result = await client
    .db("f1dashboard")
    .collection("sessions")
    .findOne(
      { slug: searchSlug },
      {
        projection: {
          _id: 0,
          name: 1,
          type: 1,
          startDate: 1,
          endDate: 1,
          sessionKey: 1,
          drivers: 1,
          circuitKey: 1,
        },
      }
    );
  if (result) {
    return c.json(result);
  } else {
    c.status(404);
    return c.json({ message: "Session not found" });
  }
};
