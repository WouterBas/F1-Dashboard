import { Hono } from "hono";
import { login, checkLoginStatus } from "./controller";
import { auth } from "../../middleware";
import { validateUser } from "./validation.middleware";

const authRouter = new Hono();

authRouter.post("/login", validateUser, login);
authRouter.get("/login", auth, checkLoginStatus);

export default authRouter;
