import { test, expect, describe } from "bun:test";

describe("Circuits", () => {
  test("should get all circuits", async () => {
    const response = await fetch("http://localhost:4000/api/v1/circuit/all");
    const data: any = await response.json();
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toBeObject();
    expect(data[0]).toHaveProperty("_id");
    expect(data[0]).toHaveProperty("name");
    expect(data[0]).toHaveProperty("latestSession");
    expect(data[0]._id).toBeString();
    expect(data[0].name).toBeString();
    expect(data[0].latestSession).toBeNumber();
  });

  test("should get circuit by id", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/circuit/info/664f8e1d76877c9741ba8413"
    );
    const data: any = await response.json();
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data._id).toEqual("664f8e1d76877c9741ba8413");
    expect(data.name).toEqual("Austin");
    expect(data.duration).toBeNumber();
    expect(data.selectedDriver).toBeNumber();
    expect(data.startTime).toBeString();
    expect(data.sessionInfo.drivers).toBeArray();
    expect(data.sessionInfo.drivers).toHaveLength(20);
    expect(data.sessionInfo.sessionKey).toBeNumber();
  });

  test("should get circuit points", async () => {
    const response = await fetch(
      "http://localhost:4000/api/v1/circuit/points/63"
    );
    const data: any = await response.json();
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
    expect(data[0]).toBeObject();
    expect(data[0]).toHaveProperty("x");
    expect(data[0]).toHaveProperty("y");
    expect(data[0].x).toBeNumber();
    expect(data[0].y).toBeNumber();
  });
});
