import { Hono } from "hono";
import {
  getCircuitPoints,
  patchCircuit,
  getAllCircuits,
  getCircuitInfoById,
} from "./controller";

const circuitRouter = new Hono();

circuitRouter.get("/all", getAllCircuits);
circuitRouter.get("/points/:key", getCircuitPoints);
circuitRouter.get("/info/:id", getCircuitInfoById);
circuitRouter.patch("/:id", patchCircuit);

export default circuitRouter;
