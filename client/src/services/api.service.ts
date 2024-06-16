import ky from "ky";

export const apiService = ky.create({
  prefixUrl: `${process.env.NEXT_PUBLIC_API_URL}/api/v1`,
});
