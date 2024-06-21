import { getSignedCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
export const auth = createMiddleware(async (c, next) => {
  const secret = process.env.TOKEN_SECRET;

  const accessToken = await getSignedCookie(c, secret, "F1-Dashboard");
  if (!accessToken) {
    c.status(401);
    return c.json({ message: "unauthorized" });
  }

  await next();
});

export const keyValidator = createMiddleware(async (c, next) => {
  const key: number = Number(c.req.param("key"));

  if (!key || key < 1) {
    c.status(400);
    return c.json({
      message: "key is required and must be a number greater than 0",
    });
  }
  await next();
});
