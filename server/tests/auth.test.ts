import { test, expect, describe } from "bun:test";

describe("Auth", () => {
  test("should error on invalid credentials", async () => {
    const response = await fetch("http://localhost:4000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "test",
        password: "test",
      }),
    });
    const data: any = await response.json();
    expect(response.status).toBe(401);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual("Incorrect credentials");
  });

  test("should error on missing credentials", async () => {
    const response = await fetch("http://localhost:4000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "test",
      }),
    });
    const data: any = await response.json();
    expect(response.status).toBe(400);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual("password is a required field");
  });

  test("should error on missing username", async () => {
    const response = await fetch("http://localhost:4000/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password: "test",
      }),
    });
    const data: any = await response.json();
    expect(response.status).toBe(400);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual("username is a required field");
  });

  test("should error on missing cookie", async () => {
    const response = await fetch("http://localhost:4000/api/v1/auth/login");
    const data: any = await response.json();
    expect(response.status).toBe(401);
    expect(data).not.toBeNull();
    expect(data).toBeInstanceOf(Object);
    expect(data.message).toEqual("unauthorized");
  });
});
