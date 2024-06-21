import { Hono } from "hono";
import { getCircuitPoints, patchCircuit, getAllCircuits } from "./controller";
import { auth, keyValidator } from "../../middleware";
import { validateCircuit } from "./validation.middleware";

const circuitRouter = new Hono();

circuitRouter.get("/all", getAllCircuits);
circuitRouter.get("/points/:key", keyValidator, getCircuitPoints);
circuitRouter.patch("/:key", keyValidator, auth, validateCircuit, patchCircuit);

export default circuitRouter;
