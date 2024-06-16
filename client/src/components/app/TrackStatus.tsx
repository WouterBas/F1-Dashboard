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
          textColor="text-red-500"
          borderColor="border-red-500"
          trackStatus={trackStatus}
          icon={<FaFlag />}
        />
      )}
      {(trackStatus === "Yellow Flag" ||
        trackStatus === "VSC Deployed" ||
        trackStatus === "VSC Ending") && (
        <TrackSatusBanner
          textColor="text-amber-400"
          borderColor="border-amber-400"
          trackStatus={trackStatus}
          icon={<FaFlag />}
        />
      )}
      {trackStatus === "SC Deployed" && (
        <TrackSatusBanner
          textColor="text-amber-400"
          borderColor="border-amber-400"
          trackStatus={trackStatus}
          icon={<FaCarOn />}
        />
      )}
      {trackStatus === "Finished" && (
        <TrackSatusBanner
          textColor="text-white"
          borderColor="border-white"
          trackStatus={trackStatus}
          icon={<FaFlagCheckered />}
        />
      )}
    </>
  );
};
export default TrackStatus;
