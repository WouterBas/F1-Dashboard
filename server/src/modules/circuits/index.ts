import { Hono } from "hono";
import {
  getCircuitPoints,
  patchCircuit,
  getAllCircuits,
  getCircuitInfoById,
} from "./controller";
import { auth } from "../../middleware";

const circuitRouter = new Hono();

circuitRouter.get("/all", getAllCircuits);
circuitRouter.get("/points/:key", getCircuitPoints);
circuitRouter.get("/info/:id", auth, getCircuitInfoById);
circuitRouter.patch("/:key", auth, patchCircuit);

export default circuitRouter;
