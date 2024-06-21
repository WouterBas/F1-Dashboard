import { test, expect, describe } from "bun:test";

describe("Timingdata", () => {
  test("should get timingdata by key", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/timingdata/9531"
    );
    const data: any = await response.json();
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toBeObject();
    expect(data[0]).toHaveProperty("timestamp");
    expect(data[0]).toHaveProperty("lines");
    expect(data[0].lines).toBeObject();
  });

  test("should not found timingdata", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/timingdata/9999"
    );
    const data: any = await response.json();
    expect(response.status).toBe(404);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual("Timingdata not found");
  });

  test("should error on invalid key", async () => {
    const response = await fetch("http://localhost:4000/api/v1/timingdata/abc");
    const data: any = await response.json();
    expect(response.status).toBe(400);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual(
      "key is required and must be a number greater than 0"
    );
  });
});
