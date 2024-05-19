import { apiService } from "@/services/api.service";
import { Fetcher } from "swr";

const fetcher: Fetcher<any> = (url: string) =>
  apiService.get(url).then((res) => res.json());

export default fetcher;
