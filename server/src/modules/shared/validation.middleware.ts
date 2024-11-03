import { createMiddleware } from "hono/factory";
import { object, number, date } from "yup";

const positionSchema = object().shape({
  key: number().min(1).max(9999).required(),
  minute: number().min(0).required(),
  startTime: date().required(),
});

export const validateKeyMinute = createMiddleware(async (c, next) => {
  const key: number = Number(c.req.param("key"));
  const minute: number = Number(c.req.query("minute"));
  const startTime: Date = new Date(c.req.query("starttime") as string);
  try {
    await positionSchema.validate({
      key,
      minute,
      startTime,
    });
  } catch (err) {
    c.status(400);
    return c.json({ message: (err as Error).message });
  }
  await next();
});
