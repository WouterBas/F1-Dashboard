import { test, expect, describe } from "bun:test";

describe("Position", () => {
  test("Should get positions by key, minute and startdate", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/position/9515?minute=0&starttime=2024-05-19T13:05:00.000Z"
    );
    const data: any = await response.json();
    expect(response.status).toBe(200);
    expect(data).not.toBeNull();
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toBeObject();
    expect(data[0]).toHaveProperty("timestamp");
    expect(data[0]).toHaveProperty("entries");
    expect(data[0].entries).toBeObject();
  });

  test("Should get positions by driver, key, startdate and duration", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/position/1/9472?starttime=2024-03-02T15:07:00.000Z&duration=60000"
    );
    const data: any = await response.json();
    expect(response.status).toBe(200);
    expect(data).not.toBeNull();
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toBeObject();
    expect(data[0]).toHaveProperty("x");
    expect(data[0]).toHaveProperty("y");
    expect(data[0].x).toBeNumber();
    expect(data[0].y).toBeNumber();
  });

  test("Should not found positions", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/position/9999?minute=0&starttime=2024-05-19T13:05:00.000Z"
    );
    const data: any = await response.json();
    expect(response.status).toBe(404);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual("Points not found");
  });

  test("Should error on invalid key", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/position/abc?minute=0&starttime=2024-05-19T13:05:00.000Z"
    );
    const data: any = await response.json();
    expect(response.status).toBe(400);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual(
      "key must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`)."
    );
  });

  test("Should error on invalid minute", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/position/1/9472?minute=abc&starttime=2024-03-02T15:07:00.000Z"
    );
    const data: any = await response.json();
    expect(response.status).toBe(400);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual(
      "duration must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`)."
    );
  });

  test("Should error on invalid startdate", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/position/1/9472?minute=0&starttime=abc&duration=60000"
    );
    const data: any = await response.json();
    expect(response.status).toBe(400);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual(
      "starttime must be a `date` type, but the final value was: `Invalid Date` (cast from the value `Invalid Date`)."
    );
  });

  test("Should error on invalid duration", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/position/1/9472?minute=0&starttime=2024-03-02T15:07:00.000Z&duration=abc"
    );
    const data: any = await response.json();
    expect(response.status).toBe(400);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual(
      "duration must be a `number` type, but the final value was: `NaN` (cast from the value `NaN`)."
    );
  });

  test("Should error on invalid driver", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/position/abc/9472?starttime=2024-03-02T15:07:00.000Z&duration=60000"
    );
    const data: any = await response.json();
    expect(response.status).toBe(400);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual(
      'driverNumber must be a `number` type, but the final value was: `NaN` (cast from the value `"abc"`).'
    );
  });
});
