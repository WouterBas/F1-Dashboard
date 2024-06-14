import SelectSession from "@/components/home/SelectSession";
import { apiService } from "@/services/api.service";
import { SessionList } from "@/types";
import HomeInitializer from "@/components/home/HomeInitializer";

export default async function Home() {
  async function fetchSessions() {
    const response = await apiService.get("session/all", {
      next: { revalidate: 600 },
    });
    const data: SessionList[] = await response.json();
    return data;
  }

  const sessions: SessionList[] = await fetchSessions();

  return (
    <>
      <main className="col-span-2 grid h-[calc(100dvh-52px)] items-center sm:h-[calc(100dvh-72px)] md:h-[calc(100dvh-86px)]">
        <HomeInitializer sessions={sessions}>
          <SelectSession sessions={sessions} />
        </HomeInitializer>
      </main>
    </>
  );
}
