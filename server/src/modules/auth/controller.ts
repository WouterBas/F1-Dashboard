import { Context } from "hono";
import client from "../../shared/dbConnection";
import { setSignedCookie } from "hono/cookie";

export const login = async (c: Context) => {
  const { username, password } = await c.req.json();

  const result = await client
    .db("f1dashboard")
    .collection("users")
    .findOne({ username });

  if (!result) {
    c.status(401);
    return c.json({ message: "Incorrect credentials" });
  }
  const correctPassword = await Bun.password.verify(password, result.password);
  if (!correctPassword) {
    c.status(401);
    return c.json({ message: "Incorrect credentials" });
  }

  const secret = process.env.TOKEN_SECRET;
  await setSignedCookie(c, "F1-Dashboard", "accessToken", secret, {
    maxAge: 3600,
    sameSite: "none",
    secure: true,
    domain: "api.f1-dashboard.app",
  });

  return c.json({ message: "success" });
};
