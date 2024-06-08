import { Hono } from "hono";
import { login } from "./controller";

const authRouter = new Hono();

authRouter.post("/login", login);

export default authRouter;
