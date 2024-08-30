import ky from "ky";

export const apiService = ky.create({
  prefixUrl: `http://localhost:4000/api/v1`,
});
