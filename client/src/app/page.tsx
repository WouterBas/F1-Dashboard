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
      <main className="col-span-2 grid h-[calc(100dvh-52px)] grid-rows-[1.5fr_2fr_auto] items-center sm:h-[calc(100dvh-72px)] md:h-[calc(100dvh-86px)]">
        <h2 className="upp mx-auto mb-16 w-11/12 max-w-xs self-end rounded text-center text-lg font-bold sm:text-xl md:max-w-xl md:text-2xl">
          Experience Formula 1 with Detailed Telemetry Insights
        </h2>
        <HomeInitializer sessions={sessions}>
          <SelectSession sessions={sessions} />
        </HomeInitializer>
        <p className=" font-sans text-[10px] text-neutral-700">
          This project/website is unofficial and is not associated in any way
          with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA
          ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks
          of Formula One Licensing B.V
        </p>
      </main>
    </>
  );
}
