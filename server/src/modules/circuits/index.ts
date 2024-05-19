import { Hono } from "hono";
import {
  getCircuitById,
  patchCircuit,
  getAllCircuits,
  getCircuitInfoById,
} from "./controller";

const circuitRouter = new Hono();

circuitRouter.get("/all", getAllCircuits);
circuitRouter.get("/:id", getCircuitById);
circuitRouter.get("/info/:id", getCircuitInfoById);
circuitRouter.patch("/:id", patchCircuit);

export default circuitRouter;
