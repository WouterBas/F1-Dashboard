"use client";
import { apiService } from "@/services/api.service";
import { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Page = () => {
  const router = useRouter();
  const [serverError, setServerError] = useState<string>("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = {
      username: e.currentTarget.username.value,
      password: e.currentTarget.password.value,
    };

    try {
      const res = await apiService.post("auth/login", {
        json: body,
        credentials: "include",
      });
      if (res.status === 200) {
        router.push("/admin/edit");
      }
    } catch (error) {
      const data = await (error as HTTPError).response.json();
      console.log(data);
      setServerError(data.message);
    }
  };

  return (
    <main className="flex h-screen items-center justify-center">
      <form
        className="grid w-80 gap-4 rounded-md bg-neutral-800 px-6 py-4"
        onSubmit={submitHandler}
      >
        <p className="text-center text-lg font-semibold text-red-400">
          {serverError}
        </p>
        <div className="flex flex-col">
          <label className="text-lg" htmlFor="username">
            Username
          </label>
          <input
            className="rounded border-2 border-neutral-400 bg-neutral-800 p-1 focus:border-white focus:outline-none "
            type="text"
            name="username"
            autoComplete="off"
            id="username"
          />
        </div>
        <div className="flex flex-col">
          <label className="text-lg" htmlFor="password">
            Password
          </label>
          <input
            className="rounded border-2 border-neutral-400 bg-neutral-800 p-1 focus:border-white focus:outline-none "
            type="password"
            name="password"
            id="password"
          />
        </div>
        <button
          className="mx-auto mt-4 w-1/2 rounded border-2 py-1 text-lg"
          type="submit"
        >
          Login
        </button>
      </form>
    </main>
  );
};
export default Page;
