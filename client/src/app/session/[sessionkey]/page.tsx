"use client";
import GP from "@/components/Gp";
import { SessionGp } from "@/types";
import LeaderBoard from "@/components/LeaderBoard";
import Map from "@/components/Map";
import useSWR from "swr";
import fetcher from "@/utils/fetcher";
import { store } from "@/store";
import { useEffect } from "react";

function Page({ params }: { params: { sessionkey: string } }) {
  const { setTime, toggleIsPlaying, setWasPlaying, setMinute, isPlaying } =
    store();
  const { data: sessionInfo } = useSWR<SessionGp>(
    `session/${params.sessionkey}`,
    fetcher,
  );

  useEffect(() => {
    sessionInfo && setTime(new Date(sessionInfo.startDate));
    isPlaying && toggleIsPlaying();
    setWasPlaying(false);
    setMinute(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionInfo, setMinute, setTime, setWasPlaying, toggleIsPlaying]);

  return (
    <>
      {sessionInfo && (
        <GP
          name={sessionInfo.name}
          date={sessionInfo.startDate}
          type={sessionInfo.type}
        />
      )}
      <main className="col-span-2 grid h-[calc(100dvh-100px)] grid-cols-[auto_1fr] items-start gap-2 sm:gap-3 md:gap-4 ">
        {sessionInfo && <LeaderBoard sessionInfo={sessionInfo} />}
        {sessionInfo && <Map sessionInfo={sessionInfo} />}
      </main>
    </>
  );
}

export default Page;
