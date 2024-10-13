"use client";

import { sessionContext } from "@/store/sessionStore";
import { motion, useAnimationControls } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import {
  PiClockClockwiseBold,
  PiClockCounterClockwiseBold,
  PiFastForwardFill,
} from "react-icons/pi";
import { FaPlay, FaPause } from "react-icons/fa6";
import { useStore } from "zustand";

const ShortCuts = () => {
  const store = useContext(sessionContext);
  if (!store) throw new Error("Missing AppContext.Provider in the tree");
  const {
    incrementTime,
    decrementTime,
    toggleIsPlaying,
    speed,
    incrementSpeed,
    decrementSpeed,
    isPlaying,
  } = useStore(store);
  const controls = useAnimationControls();
  const [icon, setIcon] = useState<JSX.Element>();
  const [keyCode, setKeyCode] = useState("");

  const handlekeyPress = (event: KeyboardEvent) => {
    setTimeout(() => {
      controls.start("hidden");
    }, 300);

    if (
      event.code === "Space" ||
      event.code === "ArrowLeft" ||
      event.code === "ArrowRight" ||
      event.code === "ArrowUp" ||
      event.code === "ArrowDown"
    ) {
      controls.start("visible");
      setKeyCode(event.code);
    }

    if (event.code === "Space") {
      setIcon(isPlaying ? <FaPause /> : <FaPlay />);
      toggleIsPlaying();
    }
    if (event.code === "ArrowLeft") {
      setIcon(<PiClockCounterClockwiseBold />);
      decrementTime(1);
    }
    if (event.code === "ArrowRight") {
      setIcon(<PiClockClockwiseBold />);
      incrementTime(1);
    }
    if (event.code === "ArrowUp") {
      setIcon(<PiFastForwardFill />);
      incrementSpeed();
    }
    if (event.code === "ArrowDown") {
      setIcon(<PiFastForwardFill className="rotate-180" />);
      decrementSpeed();
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handlekeyPress);
    return () => window.removeEventListener("keydown", handlekeyPress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  return (
    <motion.div
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, scale: 0.75 },
        visible: { opacity: 1, scale: 1 },
      }}
      transition={{ duration: 0.3 }}
      className=" absolute z-10 h-fit w-fit self-center justify-self-center rounded-xl bg-neutral-700/50 p-4 px-6 backdrop-blur-sm"
    >
      <div className="grid place-items-center gap-0.5 text-5xl">
        {icon}
        <p className="text-center text-sm">
          {keyCode === "Space" && isPlaying && "Play"}
          {keyCode === "Space" && !isPlaying && "Pause"}
          {keyCode === "ArrowLeft" && "-1 min"}
          {keyCode === "ArrowRight" && "+1 min"}
          {(keyCode === "ArrowUp" || keyCode === "ArrowDown") && `x${speed}`}
        </p>
      </div>
    </motion.div>
  );
};

export default ShortCuts;
