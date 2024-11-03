import { createMiddleware } from "hono/factory";
import { object, number, date } from "yup";

const positionSchema = object().shape({
  key: number().min(1).max(9999).required(),
  minute: number().min(0).required(),
  startTime: date().required(),
});

const positionOneDriverSchema = object().shape({
  key: number().min(1).max(9999).required(),
  driverNumber: number().min(1).max(99).required(),
  starttime: date().required(),
  duration: number().min(1000).max(180000).required(),
});

export const validatePosition = createMiddleware(async (c, next) => {
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

export const validatePositionOneDriver = createMiddleware(async (c, next) => {
  const key: number = Number(c.req.param("key"));
  const driverNumber: string | undefined = c.req.param("driver");
  const starttime: Date = new Date(c.req.query("starttime") as string);
  const duration = Number(c.req.query("duration"));

  try {
    await positionOneDriverSchema.validate({
      key,
      starttime,
      duration,
      driverNumber,
    });
  } catch (err) {
    c.status(400);
    return c.json({ message: (err as Error).message });
  }
  await next();
});
