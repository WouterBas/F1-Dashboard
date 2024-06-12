import { apiService } from "@/services/api.service";
import { SessionGp, TimgingData } from "@/types";
import LeaderBoardClient from "@/components/LeaderBoardClient";

const LeaderBoard = async ({ sessionInfo }: { sessionInfo: SessionGp }) => {
  const response = await apiService.get(
    `timingdata/${sessionInfo.sessionKey}`,
    {},
  );
  const timingData: TimgingData[] = await response.json();

  return (
    <LeaderBoardClient timingData={timingData} sessionInfo={sessionInfo} />
  );
};

export default LeaderBoard;
