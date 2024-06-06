import { test, expect, describe } from "bun:test";

describe("Sessions", () => {
  test("should get all sessions", async () => {
    const response = await fetch("http://localhost:4000/api/v1/session/all");
    const data: any = await response.json();
    expect(response.status).toBe(200);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toBeObject();
    expect(data[0]).toHaveProperty("year");
    expect(data[0]).toHaveProperty("type");
    expect(data[0]).toHaveProperty("name");
    expect(data[0]).toHaveProperty("sessionKey");
    expect(data[0].year).toBeNumber;
    expect(data[0].type).toBeString;
    expect(data[0].name).toBeString;
    expect(data[0].sessionKey).toBeNumber;
  });

  test("should get session by key", async () => {
    const response = await fetch("http://localhost:4000/api/v1/session/9515");
    const data: any = await response.json();
    expect(response.status).toBe(200);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.name).toEqual("Emilia Romagna Grand Prix");
    expect(data.sessionKey).toEqual(9515);
    expect(data.circuitKey).toEqual(6);
    expect(data.circuitName).toEqual("Imola");
    expect(data.drivers).toBeArray();
    expect(data.drivers).toHaveLength(20);
  });
});
