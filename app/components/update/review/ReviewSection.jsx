"use client";
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Navigation } from "swiper/modules";
import ReviewCard from "./ReviewCard";

const ReviewSection = () => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0); // Track the active slide index

  return (
    <div className="py-5 relative">
      <h6 className="text-center text-2xl font-bold pb-8 uppercase">Reviews</h6>

      <Swiper
        slidesPerView={1}
        centeredSlides={true}
        spaceBetween={30}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1200: {
            slidesPerView: 2.2,
            spaceBetween: 50,
          },
        }}
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={(swiper) => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)} // Update active index on slide change
        className="review-section "
        loop={true}
      >
        {[...Array(5)].map((_, index) => (
          <SwiperSlide
            key={index}
            className={`transition-all ease-in-out duration-300 ${
              activeIndex === index
                ? "opacity-100 border border-black"
                : "opacity-50"
            }`}
          >
            <div>
              <ReviewCard />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom navigation buttons */}
      {/* <div
        ref={prevRef}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-white   rounded-full h-10 w-10  border border-black "
      >
        <i className="ri-arrow-left-s-line text-xl flex items-center justify-center"></i>
      </div>
      <div
        ref={nextRef}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 cursor-pointer z-10 bg-white   rounded-full h-10 w-10  border border-black "
      >
        <i className="ri-arrow-right-s-line text-xl flex items-center justify-center"></i>
      </div> */}
    </div>
  );
};

export default ReviewSection;
