import { ObjectId } from "mongodb";
import client from "../../shared/dbConnection";
import { Context } from "hono";
import { PatchCircuit } from "../../types";

export const getCircuitById = async (c: Context) => {
  const id: string = c.req.param("id");
  const result = await client
    .db("f1dashboard")
    .collection("circuits")
    .findOne({ _id: new ObjectId(id) });
  return c.json(result);
};

export const getCircuitInfoById = async (c: Context) => {
  const id: string = c.req.param("id");
  const [result] = await client
    .db("f1dashboard")
    .collection("circuits")
    .aggregate([
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
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
              $limit: 1,
            },
            {
              $project: { drivers: 1, _id: 0, startDate: 1, sessionKey: 1 },
            },
          ],
          as: "sessionInfo",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          selectedDriver: 1,
          startTime: 1,
          duration: 1,
          sessionInfo: { $arrayElemAt: ["$sessionInfo", 0] },
        },
      },
    ])
    .toArray();
  return c.json(result);
};

export const patchCircuit = async (c: Context) => {
  const id: string = c.req.param("id");
  const { selectedDriver, startTime, duration, circuitPoints }: PatchCircuit =
    await c.req.json();

  const result = await client
    .db("f1dashboard")
    .collection("circuits")
    .updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          circuitPoints,
          selectedDriver,
          startTime,
          duration,
          updatedAt: new Date(),
        },
      }
    );
  return c.json(result);
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
              $limit: 1,
            },
            {
              $project: { sessionKey: 1, _id: 0 },
            },
          ],
          as: "latestSession",
        },
      },
      { $sort: { name: 1 } },
      {
        $project: {
          _id: 1,
          name: 1,
          latestSession: { $arrayElemAt: ["$latestSession.sessionKey", 0] },
        },
      },
    ])
    .toArray();

  const circuitNames = result.map((circuit) => circuit.name);
  return c.json(result);
};
