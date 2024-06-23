import { test, expect, describe } from "bun:test";

describe("Circuits", () => {
  test("should get all circuits", async () => {
    const response = await fetch("http://localhost:4000/api/v1/circuit/all");
    const data: any = await response.json();
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toBeObject();
    expect(data[0]).toHaveProperty("name");
    expect(data[0]).toHaveProperty("circuitKey");
    expect(data[0].name).toBeString();
    expect(data[0].circuitKey).toBeNumber();
  });

  test("should get circuit points", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/circuit/points/63"
    );
    const data: any = await response.json();
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data).toHaveProperty("angle");
    expect(data).toHaveProperty("aspectRatio");
    expect(data).toHaveProperty("circuitPoints");
    expect(data.circuitPoints.length).toBeGreaterThan(0);
    expect(data.angle).toBeNumber();
    expect(data.aspectRatio).toBeNumber();
    expect(data.circuitPoints[0]).toBeObject();
    expect(data.circuitPoints[0]).toHaveProperty("x");
    expect(data.circuitPoints[0]).toHaveProperty("y");
    expect(data.circuitPoints[0].x).toBeNumber();
    expect(data.circuitPoints[0].y).toBeNumber();
  });

  test("should not found circuit", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/circuit/points/9999"
    );
    const data: any = await response.json();
    expect(response.status).toBe(404);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual("Circuit not found");
  });

  test("should error on invalid key", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/circuit/points/abc"
    );
    const data: any = await response.json();
    expect(response.status).toBe(400);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual(
      "key is required and must be a number greater than 0"
    );
  });

  test("should error when no cookies", async () => {
    const response = await fetch("http://localhost:4000/api/v1/circuit/1", {
      method: "PATCH",
    });
    const data: any = await response.json();
    expect(response.status).toBe(401);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual("unauthorized");
  });
});
