"use client"

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ProductCard from '../ProductCard';
import { useStatus } from "@/context/contextStatus";
import { useEffect, useState } from "react";
import request from "@/lib/request";
import CountdownTimer from "./CountdownTimer";
import { AiOutlineThunderbolt } from "react-icons/ai";
import Link from "next/link";



const HotDetails = ({ flashProd }) => {

  const { settingsData } = useStatus();


   const [diffTimes, setDiffTimes] = useState();

   const [currentDate, setCurrentDate] = useState(Date.now());

   useEffect(() => {
     const intervalID = setInterval(() => {
       setCurrentDate(Date.now());
     }, 1000);

     return () => {
       clearInterval(intervalID);
     };
   }, []);

   useEffect(() => {
     if (currentDate <= new Date(settingsData?.flashData?.endTime).getTime()) {
       if (settingsData?.flashData) {
         let endTime = new Date(settingsData?.flashData?.endTime).getTime();

         let diffTime = endTime - currentDate;

         setDiffTimes(diffTime);
       }
     } else if (
       currentDate > new Date(settingsData?.flashData?.endTime).getTime()
     ) {
       const checkFlashDeal = async () => {
         const res = await request(`flashdeal/check-flashdeal`);
         if (res?.success) {
           window.location.reload();
         }
       };
       checkFlashDeal();
     }
   }, [settingsData?.flashData, currentDate]);

    //  console.log("diffTimes...", diffTimes);

  return (
    <div>
      <div className="flex justify-between p-2">
        <div className="flex items-center">
          <button className="font-semibold text-white px-1 py-1 bg-secondary rounded-md text-sm tracking-wider flex items-center space-x-2">
            <AiOutlineThunderbolt color="#fff" size={20} />
          </button>

          <span className="font-bold pl-2 text-lg xls:text-sm xms:text-sm xs:text-xs tracking-wider capitalize text-black">
            Flash Deal
          </span>

          <div className="xls:hidden xms:hidden xs:hidden sm:block md:block lg:block xl:block xxl:block">
            <CountdownTimer countdown={diffTimes} />
          </div>
        </div>

        <Link
          href="/flash-products"
          className="font-medium px-4 py-1  text-white text-sm bg-secondary cursor-pointer"
        >
          See all
        </Link>
      </div>

      <div className="xls:block xms:block xs:block hidden">
        <CountdownTimer countdown={diffTimes} />
      </div>
      <div className=" pt-3">
        <div className="grid grid-cols-5 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-3 xls:grid-cols-2 xms:grid-cols-2 xs:grid-cols-2 gap-6 md:gap-4 sm:gap-3 xls:gap-2 xms:gap-2 xs:gap-2">
          {flashProd?.map((item, index) => (
            <div key={index}>
              <ProductCard productDetails={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HotDetails