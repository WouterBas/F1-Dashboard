import { test, expect, describe } from "bun:test";

describe("Trackstatus", () => {
  test("should get trackstatus by key", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/trackstatus/9515"
    );
    const data: any = await response.json();
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toBeObject();
    expect(data[0]).toHaveProperty("timestamp");
    expect(data[0]).toHaveProperty("status");
    expect(data[0].status).toBeString();
  });

  test("should not found trackstatus", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/trackstatus/9999"
    );
    const data: any = await response.json();
    expect(response.status).toBe(404);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual("Trackstatus not found");
  });

  test("should error on invalid key", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/trackstatus/abc"
    );
    const data: any = await response.json();
    expect(response.status).toBe(400);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual(
      "key is required and must be a number greater than 0"
    );
  });
});
