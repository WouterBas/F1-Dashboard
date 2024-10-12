import { apiService } from "@/services/api.service";
import { CircuitInfo, SessionGp, Trackstatus } from "@/types";
import MediaControls from "./MediaControls";
import Labels from "./Labels";
import TrackStatus from "./TrackStatus";
import ShortCuts from "./ShortCuts";

const Map = dynamic(() => import("./Map"), {
  loading: () => <p>Loading...</p>,
});

import dynamic from "next/dynamic";

const Main = async ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const circuitPointsRes = await apiService.get(
    `circuit/points/${sessionInfo.circuitKey}`,
  );
  const circuitInfo: CircuitInfo = await circuitPointsRes.json();

  const trackStatusRes = await apiService.get(
    `trackstatus/${sessionInfo.sessionKey}`,
    {},
  );
  const trackStatus: Trackstatus[] = await trackStatusRes.json();

  return (
    <div className="grid rounded-md bg-neutral-800 p-1 sm:p-2 md:p-3">
      <ShortCuts />
      <div className="relative flex items-start justify-between">
        <Labels />
        <TrackStatus trackStatusAll={trackStatus} />
      </div>
      <Map sessionInfo={sessionInfo} circuitInfo={circuitInfo} />
      <MediaControls sessionInfo={sessionInfo} trackStatusAll={trackStatus} />
    </div>
  );
};
export default Main;
