import { test, expect, describe } from "bun:test";

describe("Position", () => {
  test("Should get positions by key, minute and startdate", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/position/9515?minute=0&starttime=2024-05-19T13:00:00.000Z"
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
      "http://localhost:4000/api/v1/position/1/9472?starttime=2024-03-02T15:01:00.000Z&duration=60000"
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
});
