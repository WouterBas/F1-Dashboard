import GP from "@/components/session/Gp";
import { SessionGp, SessionList, TimgingData } from "@/types";
import { apiService } from "@/services/api.service";
import AppProvider from "@/components/session/AppProvider";
import { HTTPError } from "ky";
import Link from "next/link";
import Main from "@/components/session/Main";
import LeaderBoard from "@/components/session/LeaderBoard";
import Header from "@/components/Header";

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
    description: `Relive the ${sessionInfo.name} ${new Date(sessionInfo.startDate).getFullYear()} on F1 Dashboard. Explore detailed telemetry data, track driver positions, rankings, and track status through an interactive timeline.`,
    openGraph: {
      title: `F1 Dashboard | ${sessionInfo.name} | ${new Date(sessionInfo.startDate).getFullYear()} | ${sessionInfo.type}`,
      description: `Relive the ${sessionInfo.name} ${new Date(sessionInfo.startDate).getFullYear()} on F1 Dashboard. Explore detailed telemetry data, track driver positions, rankings, and track status through an interactive timeline.`,
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

    const timingDataRes = await apiService.get(
      `timingdata/${sessionInfo.sessionKey}`,
      {},
    );
    const timingData: TimgingData[] = await timingDataRes.json();

    return (
      <AppProvider sessionInfo={sessionInfo}>
        <header className="flex justify-between">
          <Header />
          <GP sessionInfo={sessionInfo} />
        </header>
        <main className="grid grid-cols-[auto_1fr] items-start gap-1 sm:gap-2 md:gap-3">
          <LeaderBoard timingData={timingData} sessionInfo={sessionInfo} />
          <Main sessionInfo={sessionInfo} />
        </main>
      </AppProvider>
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
