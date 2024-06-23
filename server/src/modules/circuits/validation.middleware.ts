import { createMiddleware } from "hono/factory";
import { object, number, date, array } from "yup";

const pointsSchema = object().shape({
  x: number().required(),
  y: number().required(),
});

const circuitShema = object().shape({
  sessionKey: number().min(1).max(9999).required(),
  driverKey: number().min(1).max(99).required(),
  startTime: date().required(),
  duration: number().min(60000).max(180000).required(),
  circuitPoints: array().of(pointsSchema).required(),
  angle: number().min(0).max(360).required(),
  aspectRatio: number().min(0).max(5).required(),
});

export const validateCircuit = createMiddleware(async (c, next) => {
  const body = await c.req.json();
  try {
    await circuitShema.validate(body);
  } catch (err) {
    c.status(400);
    return c.json({ message: (err as Error).message });
  }
  await next();
});
