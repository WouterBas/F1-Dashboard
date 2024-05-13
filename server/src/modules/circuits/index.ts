import { Hono } from "hono";
import { getCircuitById, patchCircuit } from "./controller";

const circuitRouter = new Hono();

circuitRouter.get("/:id", getCircuitById);
circuitRouter.patch("/:id", patchCircuit);

export default circuitRouter;
