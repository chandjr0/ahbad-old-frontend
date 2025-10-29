"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { imageBasePath } from "@/config";


const Slider = ({ slider }) => {


  return (
    <div>
      <Swiper
        slidesPerView={1}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={true}
        modules={[Autoplay, Pagination]}
      >
        <div>
          {slider?.sliderImgs?.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="h-auto">
                <Image
                  width={200}
                  height={200}
                  src={`${imageBasePath}/${item?.image}`}
                  className="object-contain h-auto w-full"
                  alt={`slider-${index + 1}`}
                  priority={true}
                  quality={100}
                  unoptimized={true}
                  onClick={() => {
                    if (item?.url) {
                      window.open(`${item?.url}`, "_blank");
                    }
                  }}
                />
              </div>
            </SwiperSlide>
          ))}
        </div>
      </Swiper>
    </div>
  );
};

export default Slider;
