import { createMiddleware } from "hono/factory";
import { object, string } from "yup";

const userSchema = object().shape({
  username: string().min(1).max(256).required(),
  password: string().min(1).max(256).required(),
});

export const validateUser = createMiddleware(async (c, next) => {
  const body = await c.req.json();
  try {
    await userSchema.validate(body);
  } catch (err) {
    c.status(400);
    return c.json({ message: (err as Error).message });
  }
  await next();
});
