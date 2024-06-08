import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";

export const auth = createMiddleware(async (c, next) => {
  const secret = process.env.TOKEN_SECRET;

  const accessToken = await getSignedCookie(c, secret, "F1-Dashboard");
  console.log(accessToken);
  if (!accessToken) {
    c.status(401);
    return c.json({ message: "unauthorized" });
  }

  await next();
});
