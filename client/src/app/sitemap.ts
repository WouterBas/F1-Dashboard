import { apiService } from "@/services/api.service";
import { SessionList } from "@/types";

const baseUrl = "https://f1-dashboard.app";

export default async function sitemap(): Promise<
  {
    url: string;
    lastModified?: string | Date | undefined;
    changeFrequency?:
      | "always"
      | "hourly"
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly"
      | "never"
      | undefined;
    priority?: number | undefined;
  }[]
> {
  const response = await apiService.get("session/all", {
    next: { revalidate: 600 },
  });
  const data: SessionList[] = await response.json();

  const posts = data.map(({ slug }) => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date().toISOString(),
    priority: 0.5,
  }));

  const indexRout = {
    url: `${baseUrl}`,
    lastModified: new Date().toISOString(),
    priority: 1,
  };

  return [indexRout, ...posts];
}
