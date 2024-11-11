"use client";

import { useEffect, useState } from "react";

const Live = () => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:4000/api/v1/live");

    eventSource.onopen = (event) => {
      console.log(event);
    };
    eventSource.onmessage = (e) => {
      setTime(e.data);
    };

    return () => eventSource.close();
  }, []);

  return (
    <>
      <h2 className="text-2xl">Live</h2>
      <p>{time}</p>
    </>
  );
};

export default Live;
