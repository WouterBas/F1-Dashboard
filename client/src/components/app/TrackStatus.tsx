import { useAppStore } from "@/store/appStore";
import { Trackstatus } from "@/types";
import { useEffect } from "react";
import { FaFlag, FaFlagCheckered, FaCarOn } from "react-icons/fa6";
import TrackSatusBanner from "@/components/app/TrackSatusBanner";

const TrackStatus = ({ trackStatusAll }: { trackStatusAll: Trackstatus[] }) => {
  const { time, trackStatus, setTrackStatus } = useAppStore();

  // find track status closest to time
  useEffect(() => {
    const closestTrackStatus = trackStatusAll.reduce((prev, curr) => {
      const currentTime = new Date(curr.timestamp).getTime();
      if (
        currentTime < time.getTime() &&
        currentTime > new Date(prev.timestamp).getTime()
      ) {
        return curr;
      }
      return prev;
    });

    setTrackStatus(closestTrackStatus.status);
  }, [trackStatusAll, time, setTrackStatus]);

  return (
    <>
      {trackStatus === "Red Flag" && (
        <TrackSatusBanner
          color="red-400"
          trackStatus={trackStatus}
          icon={<FaFlag />}
        />
      )}
      {(trackStatus === "Yellow Flag" ||
        trackStatus === "VSC Deployed" ||
        trackStatus === "VSC Ending") && (
        <TrackSatusBanner
          color="yellow-400"
          trackStatus={trackStatus}
          icon={<FaFlag />}
        />
      )}
      {trackStatus === "SC Deployed" && (
        <TrackSatusBanner
          color="amber-400"
          trackStatus={trackStatus}
          icon={<FaCarOn />}
        />
      )}
      {trackStatus === "Finished" && (
        <TrackSatusBanner
          color="green-400"
          trackStatus={trackStatus}
          icon={<FaFlagCheckered />}
        />
      )}
    </>
  );
};
export default TrackStatus;
