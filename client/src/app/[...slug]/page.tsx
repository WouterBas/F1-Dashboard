import GP from "@/components/app/Gp";
import { SessionGp, SessionList } from "@/types";
import LeaderBoardServer from "@/components/app/LeaderBoardServer";
import MapCircuitServer from "@/components/app/MapCircuitServer";
import { apiService } from "@/services/api.service";
import AppInitializer from "@/components/app/AppInitializer";
import { HTTPError } from "ky";
import Link from "next/link";

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
    description: "",
  };
}

async function Page({ params }: { params: { slug: string[] } }) {
  const slug = params.slug.join("/");

  try {
    const response = await apiService.get(`session/${slug}`, {
      next: { revalidate: 600 },
    });
    const sessionInfo: SessionGp = await response.json();
    return (
      <AppInitializer sessionInfo={sessionInfo}>
        <GP sessionInfo={sessionInfo} />
        <main className="col-span-2 grid h-[calc(100dvh-100px)] grid-cols-[auto_1fr] items-start gap-1 sm:gap-2 md:gap-3">
          <LeaderBoardServer sessionInfo={sessionInfo} />
          <MapCircuitServer sessionInfo={sessionInfo} />
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
