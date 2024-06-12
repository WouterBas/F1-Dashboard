import { apiService } from "@/services/api.service";
import { CircuitPoints, SessionGp } from "@/types";
import MapCircuitClient from "@/components/MapCircuitClient";

const MapCircuitServer = async ({
  sessionInfo,
}: {
  sessionInfo: SessionGp;
}) => {
  const response = await apiService.get(
    `circuit/points/${sessionInfo.circuitKey}`,
  );
  const circuitPoints: CircuitPoints[] = await response.json();

  return (
    <MapCircuitClient circuitPoints={circuitPoints} sessionInfo={sessionInfo} />
  );
};
export default MapCircuitServer;
