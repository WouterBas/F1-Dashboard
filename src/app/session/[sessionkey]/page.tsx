"use client";
import GP from "@/components/Gp";
import { useEffect, useState } from "react";
import { SessionGp } from "@/types/defentions";
import LeaderBoard from "@/components/LeaderBoard";
import Map from "@/components/Map";

function Page({ params }: { params: { sessionkey: string } }) {
  const [sessionInfo, setSessionInfo] = useState<SessionGp>({} as SessionGp);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function getSessionInfo() {
      const response = await fetch(
        `https://api.f1-dashboard.app/session/${params.sessionkey}`,
      );
      const data: SessionGp = await response.json();
      setSessionInfo(data);
      setLoading(false);
    }
    getSessionInfo();
  }, [params.sessionkey]);

  return (
    <>
      {!loading && (
        <GP
          name={sessionInfo.name}
          date={sessionInfo.startDate}
          type={sessionInfo.type}
        />
      )}
      <main className="col-span-2 grid h-[calc(100dvh-100px)] grid-cols-[auto_1fr] items-start gap-4">
        {!loading && <LeaderBoard drivers={sessionInfo.drivers} />}
        {/* {!loading && <Map circuitInfo={sessionInfo.circuit} />} */}
      </main>
    </>
  );
}

export default Page;
