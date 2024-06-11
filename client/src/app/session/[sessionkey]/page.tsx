import GP from "@/components/Gp";
import { SessionGp } from "@/types";
import LeaderBoard from "@/components/LeaderBoard";
import Map from "@/components/Map";
import { apiService } from "@/services/api.service";
import SetDefaults from "@/components/SetDefaults";

async function Page({ params }: { params: { sessionkey: string } }) {
  const response = apiService.get(`session/${params.sessionkey}`, {
    next: { revalidate: 600 },
  });
  const sessionInfo: SessionGp = await response.json();

  return (
    <>
      <GP sessionInfo={sessionInfo} />

      <main className="col-span-2 grid h-[calc(100dvh-100px)] grid-cols-[auto_1fr] items-start gap-2 sm:gap-3 md:gap-4 ">
        <SetDefaults sessionInfo={sessionInfo} />
        <LeaderBoard sessionInfo={sessionInfo} />
        <Map sessionInfo={sessionInfo} />
      </main>
    </>
  );
}

export default Page;
