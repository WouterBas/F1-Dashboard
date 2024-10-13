import { useContext, useLayoutEffect, useRef } from "react";
import { sessionContext } from "@/store/sessionStore";
import { useStore } from "zustand";

const useClock = () => {
  const store = useContext(sessionContext);
  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  const { isPlaying, setTime, speed, endTime } = useStore(store);

  const animationRef = useRef<number | undefined>(undefined);
  const lastUpdateTime = useRef<number>(0); // Tracks when the last frame was updated

  const tick = (currentTimestamp: number) => {
    if (lastUpdateTime.current) {
      const delta = currentTimestamp - lastUpdateTime.current; // Time elapsed since the last frame
      setTime((prevTime) =>
        new Date(prevTime.getTime() + delta * speed) > endTime
          ? endTime
          : new Date(prevTime.getTime() + delta * speed),
      ); // Update the time by the delta
    }
    lastUpdateTime.current = currentTimestamp; // Update the last update time for the next frame
    animationRef.current = requestAnimationFrame(tick); // Request the next frame
  };

  useLayoutEffect(() => {
    if (isPlaying) {
      lastUpdateTime.current = performance.now(); // Track when the clock resumes
      animationRef.current = requestAnimationFrame(tick); // Start the animation
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current); // Stop the animation
    }
    return () => cancelAnimationFrame(animationRef.current!); // Cleanup on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, speed]);
};

export default useClock;
