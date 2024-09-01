"use client";
import { apiService } from "@/services/api.service";
import { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { useState } from "react";

const Login = () => {
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
      const data = await res.json();
      if (res.status === 200 && data) {
        router.refresh();
      }
    } catch (error) {
      const data: { message: string } = await (
        error as HTTPError
      ).response.json();
      setServerError(data.message);
    }
  };
  return (
    <form
      className="grid w-80 gap-4 self-center justify-self-center rounded-md bg-neutral-800 p-4 px-6"
      onSubmit={submitHandler}
    >
      <p className="text-center font-semibold text-red-400">{serverError}</p>
      <div className="flex flex-col">
        <label className="sm:text-lg" htmlFor="username">
          Username
        </label>
        <input
          className="rounded border-2 border-neutral-400 bg-neutral-800 p-1 text-sm focus:border-white focus:outline-none sm:text-base"
          type="text"
          name="username"
          autoComplete="off"
          id="username"
        />
      </div>
      <div className="flex flex-col">
        <label className="sm:text-lg" htmlFor="password">
          Password
        </label>
        <input
          className="rounded border-2 border-neutral-400 bg-neutral-800 p-1 text-sm focus:border-white focus:outline-none sm:text-base"
          type="password"
          name="password"
          id="password"
        />
      </div>
      <button
        className="mx-auto mt-4 w-1/2 rounded border-2 py-1 sm:text-lg"
        type="submit"
      >
        Login
      </button>
    </form>
  );
};
export default Login;
