import GP from "@/components/app/Gp";
import {
  CircuitPoints,
  SessionGp,
  SessionList,
  TimgingData,
  Trackstatus,
} from "@/types";
import { apiService } from "@/services/api.service";
import AppInitializer from "@/components/app/AppInitializer";
import { HTTPError } from "ky";
import Link from "next/link";
import MapCircuit from "@/components/app/MapCircuit";
import LeaderBoardClient from "@/components/app/LeaderBoardClient";

export async function generateStaticParams() {
  const response = await apiService.get(`session/all`, {});
  const data: SessionList[] = await response.json();
  return data.map((session) => ({
    slug: session.slug.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string[] };
}) {
  const slug = params.slug.join("/");
  const response = await apiService.get(`session/${slug}`, {
    next: { revalidate: 600 },
  });
  const sessionInfo: SessionGp = await response.json();

  return {
    title: `F1 Dashboard | ${sessionInfo.name} | ${new Date(sessionInfo.startDate).getFullYear()} | ${sessionInfo.type}`,
    description: `Relive the ${sessionInfo.name} ${new Date(sessionInfo.startDate).getFullYear()} on F1 Dashboard. Explore detailed telemetry data, track driver positions, rankings, and track status through an interactive timeline. Analyze key race moments and performance insights to enhance your Formula 1 experience.`,
    openGraph: {
      title: `F1 Dashboard | ${sessionInfo.name} | ${new Date(sessionInfo.startDate).getFullYear()} | ${sessionInfo.type}`,
      description: `Relive the ${sessionInfo.name} ${new Date(sessionInfo.startDate).getFullYear()} on F1 Dashboard. Explore detailed telemetry data, track driver positions, rankings, and track status through an interactive timeline. Analyze key race moments and performance insights to enhance your Formula 1 experience.`,
      url: `https://f1-dashboard.app/${params.slug.join("/")}`,
      siteName: "F1 Dashboard",
      locale: "en-US",
      type: "website",
    },
  };
}

async function Page({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join("/");

  try {
    const response = await apiService.get(`session/${slug}`, {
      next: { revalidate: 600 },
    });
    const sessionInfo: SessionGp = await response.json();
    const circuitPointsRes = await apiService.get(
      `circuit/points/${sessionInfo.circuitKey}`,
    );
    const circuitPoints: CircuitPoints[] = await circuitPointsRes.json();

    const trackStatusRes = await apiService.get(
      `trackstatus/${sessionInfo.sessionKey}`,
      {},
    );
    const trackStatus: Trackstatus[] = await trackStatusRes.json();
    const timingDataRes = await apiService.get(
      `timingdata/${sessionInfo.sessionKey}`,
      {},
    );
    const timingData: TimgingData[] = await timingDataRes.json();

    return (
      <AppInitializer sessionInfo={sessionInfo}>
        <GP sessionInfo={sessionInfo} />
        <main className="col-span-2 grid h-[calc(100dvh-100px)] grid-cols-[auto_1fr] items-start gap-1 sm:gap-2 md:gap-3">
          <LeaderBoardClient
            timingData={timingData}
            sessionInfo={sessionInfo}
          />
          <MapCircuit
            circuitPoints={circuitPoints}
            sessionInfo={sessionInfo}
            trackStatus={trackStatus}
          />
        </main>
      </AppInitializer>
    );
  } catch (error) {
    const status = (error as HTTPError).response.status;
    const { message }: { message: string } = await (
      error as HTTPError
    ).response.json();
    return (
      <div className="col-span-2 flex h-[calc(100dvh-100px)] flex-col items-center justify-center">
        <h2 className="text-3xl">{status}</h2>
        <h3 className="mb-4 text-lg">{message}</h3>
        <Link className="rounded border-2 px-2 py-1" href="/">
          Home Page
        </Link>
      </div>
    );
  }
}

export default Page;
