import { apiService } from "@/services/api.service";
import { CircuitPoints, SessionGp, Trackstatus } from "@/types";
import MediaControls from "./MediaControls";
import Labels from "./Labels";
import TrackStatus from "./TrackStatus";
import Map from "./Map";

const Main = async ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const circuitPointsRes = await apiService.get(
    `circuit/points/${sessionInfo.circuitKey}`,
  );
  const circuitPoints: CircuitPoints[] = await circuitPointsRes.json();

  const trackStatusRes = await apiService.get(
    `trackstatus/${sessionInfo.sessionKey}`,
    {},
  );
  const trackStatus: Trackstatus[] = await trackStatusRes.json();

  return (
    <div className="relative max-h-[calc(100dvh-46px)] rounded-md bg-neutral-800 p-1 sm:max-h-[calc(100dvh-64px)] sm:p-2 md:max-h-[calc(100dvh-78px)] md:p-3 lg:max-h-[calc(100dvh-98px)]">
      <Labels />
      <TrackStatus trackStatusAll={trackStatus} />
      <Map sessionInfo={sessionInfo} circuitPoints={circuitPoints} />
      <MediaControls sessionInfo={sessionInfo} trackStatusAll={trackStatus} />
    </div>
  );
};
export default Main;
