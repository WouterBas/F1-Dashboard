import { apiService } from "@/services/api.service";
import { CircuitPoints, SessionGp, Trackstatus } from "@/types";
import dynamic from "next/dynamic";
// import MapCircuitClient from "@/components/app/MapCircuitClient";

const MapCircuitClient = dynamic(
  () => import("@/components/app/MapCircuitClient"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  },
);

const MapCircuitServer = async ({
  sessionInfo,
}: {
  sessionInfo: SessionGp;
}) => {
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
    <MapCircuitClient
      circuitPoints={circuitPoints}
      sessionInfo={sessionInfo}
      trackStatus={trackStatus}
    />
  );
};
export default MapCircuitServer;
