"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

const SliderSection = () => {
  const sliderData = [
    "FRENZY FRIDAY ",
    "FREE DELIVERY",
    "24/7 SUPPORT",
    "EASY EXCHANGE POLICY",
    "QUALITY ASSURANCE PRODUCT",
    "EASY RETURN POLICY",
    "FRENZY FRIDAY ",
    "FREE DELIVERY",
    "24/7 SUPPORT",
    "EASY EXCHANGE POLICY",
    "QUALITY ASSURANCE PRODUCT",
    "EASY RETURN POLICY",
    "FRENZY FRIDAY ",
    "FREE DELIVERY",
    "24/7 SUPPORT",
    "EASY EXCHANGE POLICY",
    "QUALITY ASSURANCE PRODUCT",
    "EASY RETURN POLICY",
    "FRENZY FRIDAY ",
    "FREE DELIVERY",
    "24/7 SUPPORT",
    "EASY EXCHANGE POLICY",
    "QUALITY ASSURANCE PRODUCT",
    "EASY RETURN POLICY",
    "FRENZY FRIDAY ",
    "FREE DELIVERY",
    "24/7 SUPPORT",
    "EASY EXCHANGE POLICY",
    "QUALITY ASSURANCE PRODUCT",
    "EASY RETURN POLICY",
    "FRENZY FRIDAY ",
    "FREE DELIVERY",
    "24/7 SUPPORT",
    "EASY EXCHANGE POLICY",
    "QUALITY ASSURANCE PRODUCT",
    "EASY RETURN POLICY",
    
    
  ];

  return (
    <div className="base-container border border-[#706f6f] py-4">
      <Swiper
        slidesPerView={1}
        centeredSlides={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
          reverseDirection: false,
          stopOnLastSlide: false,
        }}
        speed={10000}
        loop={true}
        modules={[Autoplay]}
        breakpoints={{
          5000: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
          1200: {
            slidesPerView: 5,
          },
          1500: {
            slidesPerView: 6,
          },
        }}
        className="mySwiper"
      >
        {sliderData.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="text-center flex gap-2 items-center">
              <div className="h-1 w-1 bg-black rounded-full"></div>
              <p className="text-black text-base font-bold uppercase">{item}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SliderSection;
