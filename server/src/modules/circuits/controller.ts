import { ObjectId } from "mongodb";
import client from "../../shared/dbConnection";
import { Context } from "hono";
import { circuitPoints } from "../../types";

export const getCircuitById = async (c: Context) => {
  const id: string = c.req.param("id");
  const result = await client
    .db("f1dashboard")
    .collection("circuits")
    .findOne({ _id: new ObjectId(id) });
  return c.json(result);
};

export const patchCircuit = async (c: Context) => {
  const id: string = c.req.param("id");
  const points: circuitPoints[] = await c.req.json();

  const result = await client
    .db("f1dashboard")
    .collection("circuits")
    .updateOne({ _id: new ObjectId(id) }, { $set: { cicuitPoints: points } });
  return c.json(result);
};

export const getAllCircuits = async (c: Context) => {
  const result = await client
    .db("f1dashboard")
    .collection("circuits")
    .find(
      {},
      {
        projection: {
          _id: 0,
          name: 1,
        },
      }
    )
    .toArray();

  const circuitNames = result.map((circuit) => circuit.name);
  return c.json(circuitNames);
};
