import GP from "@/components/Gp";
import { SessionGp, SessionList } from "@/types";
import LeaderBoard from "@/components/LeaderBoard";
import Map from "@/components/Map";
import { apiService } from "@/services/api.service";
import SetDefaults from "@/components/SetDefaults";
import { HTTPError } from "ky";
import Link from "next/link";
import slugify from "slugify";

export async function generateStaticParams() {
  const response = await apiService.get(`session/all`, {});
  const data: SessionList[] = await response.json();
  return data.map((session) => ({
    slug: [
      slugify(session.name, { lower: true }),
      slugify(session.type, { lower: true }),
      session.year.toString(),
      session.sessionKey.toString(),
    ],
  }));
}

async function Page({ params }: { params: { slug: string[] } }) {
  const sessionkey = params.slug[3];

  try {
    const response = await apiService.get(`session/${sessionkey}`, {
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
  } catch (error) {
    const status = (error as HTTPError).response.status;
    const { message }: { message: string } = await (
      error as HTTPError
    ).response.json();
    return (
      <div className="flex h-[calc(100dvh-100px)] flex-col items-center justify-center">
        <h2 className="text-3xl">{status}</h2>
        <h3 className="mb-4 text-xl">{message}</h3>
        <Link className="rounded border-2 px-2 py-1" href="/">
          Home Page
        </Link>
      </div>
    );
  }
}

export default Page;