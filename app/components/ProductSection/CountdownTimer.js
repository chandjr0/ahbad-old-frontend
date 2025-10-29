import request from "@/lib/request";

import { useEffect, useState } from "react";

export default function CountdownTimer({ countdown }) {
  

  const [remainingTime, setRemainingTime] = useState();

  useEffect(() => {
    if (countdown) {
      setRemainingTime(countdown);
    }
  }, [countdown]);

  let newRemainTime = remainingTime / 1000;

  let day = Math.floor(newRemainTime / (24 * 60 * 60));
  let dayFraction = Math.floor(newRemainTime % (24 * 60 * 60));

  let hours = Math.floor(dayFraction / (60 * 60));
  let hoursFraction = Math.floor(dayFraction % (60 * 60));
  let minutes = Math.floor(hoursFraction / 60);
  let minutesFrac = Math.floor(hoursFraction % 60);

  let seconds = Math.floor(minutesFrac);

  useEffect(() => {
    if (remainingTime < 120) {
      const checkFlashDeal = async () => {
        const res = await request(`flashdeal/check-flashdeal`);
        // console.log("res..",res);
        if (res?.success == true) {
          window.location.reload(false);
        }
      };
      checkFlashDeal();
    }
  }, [remainingTime]);

  // console.log("remainingTime...", remainingTime);

  return (
    <div className="flex space-x-3 xs:space-x-1 items-center">
      <p className="text-sm pl-6 xms:pl-3 xs:pl-2 text-black xs:text-xs">
        {" "}
        Ending in{" "}
      </p>
      <div className="flex space-x-2 xms:space-x-1 xs:space-x-0 items-center">
        <p className="bg-red-500 px-2 py-1 text-white text-sm font-semibold">
          {day.toString().padStart(2, "0") }d
        </p>
        <p className="text-black">:</p>
        <p className="bg-red-500 px-2 py-1 text-white text-sm font-semibold">
          {hours.toString().padStart(2, "0")}h
        </p>

        <p className="text-black">:</p>
        <p className="bg-red-500 px-2 py-1 text-white text-sm font-semibold">
          {minutes.toString().padStart(2, "0")}m
        </p>
        <p className="text-black">:</p>
        <p className="bg-red-500 px-2 py-1 text-white text-sm font-semibold">
          {seconds.toString().padStart(2, "0")}s
        </p>
      </div>
    </div>
    // <div>
    //   {hours}:{minutes < 10 ? `0${minutes}` : minutes}:
    //   {seconds < 10 ? `0${seconds}` : seconds}
    // </div>
  );
}
