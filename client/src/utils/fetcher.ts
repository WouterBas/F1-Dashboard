import { apiService } from "@/services/api.service";
import { Fetcher } from "swr";

const fetcher: Fetcher<any> = (url: string) =>
  apiService.get(url, { credentials: "include" }).then((res) => res.json());

export const sendRequest = async (url: string, { arg }: { arg: any }) => {
  const response = await apiService.patch(url, {
    json: arg,
    credentials: "include",
  });
  return await response.json();
};

export default fetcher;
