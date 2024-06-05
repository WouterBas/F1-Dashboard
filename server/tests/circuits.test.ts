import { test, expect, describe } from "bun:test";

describe("Circuits", () => {
  test("should get all circuits", async () => {
    const response = await fetch("http://localhost:4000/api/v1/circuit/all");
    const data: any = await response.json();
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Array);
    expect(data.length).toBeGreaterThan(0);
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
  });
});
