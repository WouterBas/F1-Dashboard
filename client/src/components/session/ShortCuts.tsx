"use client";

import { sessionContext } from "@/store/sessionStore";
import { motion, useAnimationControls } from "framer-motion";
import { useCallback, useContext, useEffect, useState } from "react";
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
  const { setTime, time, toggleIsPlaying, speed, setSpeed, isPlaying } =
    useStore(store);
  const controls = useAnimationControls();
  const [icon, setIcon] = useState<JSX.Element>();

  const checkKeyPress = useCallback(
    (event: KeyboardEvent) => {
      setTimeout(() => {
        controls.start("hidden");
      }, 300);

      const toggle = (func: void) => {
        toggleIsPlaying();
        func;
        setTimeout(() => toggleIsPlaying(), 1);
      };

      if (
        event.code === "Space" ||
        event.code === "ArrowLeft" ||
        event.code === "ArrowRight" ||
        (event.code === "ArrowUp" && speed < 32) ||
        (event.code === "ArrowDown" && speed > 1)
      ) {
        controls.start("visible");
      }

      if (event.code === "Space") {
        setIcon(isPlaying ? <FaPause /> : <FaPlay />);
        toggleIsPlaying();
      }
      if (event.code === "ArrowLeft") {
        setIcon(<PiClockCounterClockwiseBold />);
        toggle(setTime(new Date(new Date(time).getTime() - 1000 * 60)));
      }
      if (event.code === "ArrowRight") {
        setIcon(<PiClockClockwiseBold />);
        toggle(setTime(new Date(new Date(time).getTime() + 1000 * 60)));
      }
      if (event.code === "ArrowUp" && speed < 32) {
        setIcon(<PiFastForwardFill />);
        toggle(setSpeed(speed * 2));
      }
      if (event.code === "ArrowDown" && speed > 1) {
        setIcon(<PiFastForwardFill className="rotate-180" />);
        toggle(setSpeed(speed / 2));
      }
    },
    [controls, isPlaying, setSpeed, setTime, speed, time, toggleIsPlaying],
  );

  useEffect(() => {
    const handler = (event: KeyboardEvent) => checkKeyPress(event);
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
    };
  }, [checkKeyPress]);

  return (
    <motion.div
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, scale: 0.75 },
        visible: { opacity: 1, scale: 1 },
      }}
      transition={{ duration: 0.3 }}
      className=" absolute z-10 h-fit w-fit self-center justify-self-center rounded-xl bg-neutral-700/50 p-4 backdrop-blur-sm"
    >
      <span className="text-5xl">{icon}</span>
    </motion.div>
  );
};

export default ShortCuts;
