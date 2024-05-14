import { Hono } from "hono";
import { getCircuitById, patchCircuit, getAllCircuits } from "./controller";

const circuitRouter = new Hono();

circuitRouter.get("/all", getAllCircuits);
circuitRouter.get("/:id", getCircuitById);
circuitRouter.patch("/:id", patchCircuit);

export default circuitRouter;
