import SelectSession from "@/components/home/SelectSession";
import { apiService } from "@/services/api.service";
import { SessionList } from "@/types";
import HomeProvider from "@/components/home/HomeProvider";
import Header from "@/components/Header";

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
      <header>
        <Header />
      </header>
      <main className="grid grid-rows-[1fr_auto_1fr] items-center">
        <h2 className="mx-auto  w-11/12 max-w-xs rounded text-center text-lg font-bold sm:text-xl md:max-w-xl md:text-2xl">
          Experience Formula 1 with Detailed Telemetry Insights
        </h2>
        <HomeProvider sessions={sessions}>
          <SelectSession sessions={sessions} />
        </HomeProvider>
      </main>
      <footer>
        <p className=" text-center font-sans text-[10px] text-neutral-600">
          This project/website is unofficial and is not associated in any way
          with the Formula 1 companies. F1, FORMULA ONE, FORMULA 1, FIA FORMULA
          ONE WORLD CHAMPIONSHIP, GRAND PRIX and related marks are trade marks
          of Formula One Licensing B.V
        </p>
      </footer>
    </>
  );
}
