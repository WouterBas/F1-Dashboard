import { ObjectId } from "mongodb";
import client from "../../shared/dbConnection";
import { Context } from "hono";
import { PatchCircuit } from "../../types";

export const getCircuitPoints = async (c: Context) => {
  const key: number = Number(c.req.param("key"));

  const result = await client
    .db("f1dashboard")
    .collection("circuits")
    .findOne({ circuitKey: key }, { projection: { _id: 0, circuitPoints: 1 } });

  if (!result) {
    c.status(404);
    return c.json({ message: "Circuit not found" });
  }
  return c.json(result.circuitPoints);
};

export const getAllCircuits = async (c: Context) => {
  const result = await client
    .db("f1dashboard")
    .collection("circuits")
    .aggregate([
      {
        $lookup: {
          from: "sessions",
          let: { key: "$circuitKey" },
          pipeline: [
            {
              $match: { $expr: { $eq: ["$circuitKey", "$$key"] } },
            },
            {
              $sort: { startDate: -1 },
            },
            {
              $project: {
                _id: 0,
                sessionKey: 1,
                type: 1,
                startDate: 1,
                drivers: 1,
              },
            },
          ],
          as: "sessions",
        },
      },
      { $sort: { name: 1 } },
      {
        $project: {
          _id: 0,
          circuitKey: 1,
          name: 1,
          duration: 1,
          startTime: 1,
          sessionKey: 1,
          driverKey: 1,
          sessions: 1,
        },
      },
    ])
    .toArray();

  return c.json(result);
};

export const patchCircuit = async (c: Context) => {
  const key: number = parseInt(c.req.param("key"));

  const {
    sessionKey,
    driverKey,
    startTime,
    duration,
    circuitPoints,
  }: PatchCircuit = await c.req.json();

  const result = await client
    .db("f1dashboard")
    .collection("circuits")
    .updateOne(
      { circuitKey: key },
      {
        $set: {
          circuitPoints,
          sessionKey,
          driverKey,
          startTime,
          duration,
        },
      }
    );

  return await getAllCircuits(c);
};
