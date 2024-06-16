import { Hono } from "hono";
import { login, checkLoginStatus } from "./controller";
import { auth } from "../../middleware";

const authRouter = new Hono();

authRouter.post("/login", login);
authRouter.get("/login", auth, checkLoginStatus);

export default authRouter;
