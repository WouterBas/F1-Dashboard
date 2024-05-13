import { Context } from "hono";

export const test = async (c: Context) => {
  return c.text("ok");
};
