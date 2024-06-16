import { test, expect, describe } from "bun:test";

import { app } from "../src/index";

describe("Status", () => {
  test("GET /status", async () => {
    const res = await app.request("api/v1/status");
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("server is running");
  });
});
