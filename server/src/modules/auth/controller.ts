import { Context } from "hono";
import client from "../../shared/dbConnection";
import { setSignedCookie } from "hono/cookie";

export const login = async (c: Context) => {
  const body = await c.req.json();

  const username = body.username.toLowerCase();
  const password = body.password;

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

  let options = {};
  if (process.env.ENVIRONMENT === "dev") {
    options = {
      maxAge: 3600,
      domain: process.env.DOMAIN,
    };
  }

  if (process.env.ENVIRONMENT === "prod") {
    options = {
      maxAge: 3600,
      sameSite: "strict",
      secure: true,
      domain: process.env.DOMAIN,
    };
  }

  await setSignedCookie(c, "F1-Dashboard", "accessToken", secret, options);

  return c.json({ message: "success" });
};

export const checkLoginStatus = async (c: Context) => {
  return c.json({ loggedIn: true });
};
