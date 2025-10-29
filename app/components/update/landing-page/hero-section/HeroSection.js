"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { imageBasePath } from "@/config";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import { AiOutlineCrown } from "react-icons/ai";
import { useStatus } from "@/context/contextStatus";
import Link from "next/link";
import PageView from "@/app/api/conversion/PageView";

const HeroSection = ({ slider }) => {
  const { allCategories } = useStatus();
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [childrenData, setChildrenData] = useState([]);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      setChildrenData([]);
      setHoveredCategory(null);
    }
  }, [isHovered]);

  const handleMouseEnterCategory = (category) => {
    setHoveredCategory(category?.name);
    if (category?.children) {
      setChildrenData(category?.children);
    } else {
      setChildrenData([]);
    }
    setIsHovered(true);
  };

  const handleMouseLeaveGrid = () => {
    setIsHovered(false);
    setHoveredCategory(null);
    setChildrenData([]);
  };


  return (
    <div className="base-container">
      <PageView />

      <div
        className="grid grid-cols-12 relative"
        onMouseLeave={handleMouseLeaveGrid}
      >
        {/* Sidebar Section */}
        <div className="hidden lg:block lg:col-span-3 2xl:col-span-2 h-[460px] overflow-y-scroll custom-scrollbar bg-white">
          {allCategories?.map((category, index) => (
            <Link
              href={`/category/${category?.slug}`}
              key={index}
              className="p-3 group hover:bg-[#c2b6b631] border border-t-0 flex gap-3 cursor-pointer"
              onMouseEnter={() => handleMouseEnterCategory(category)}
            >
              {/* <AiOutlineCrown className="text-black" /> */}
              <Image
                src={`${imageBasePath}/${category?.imageForCategoryProduct}`}
                alt="category"
                width={0}
                height={0}
                sizes={100}
                className="w-5 h-5"
              />
              <h3 className="text-sm text-black uppercase font-medium group-hover:ml-2 transition-all duration-300">
                {category?.name}
              </h3>
            </Link>
          ))}
        </div>

        {/* Dynamic Content Section */}
        <div className="col-span-12 lg:col-span-9 2xl:col-span-10 bg-white">
          {childrenData?.length > 0 && isHovered ? (
            <div className="bg-white h-[460px] overflow-y-auto custom-scrollbar px-6 py-4">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {childrenData?.map((child, idx) => (
                  <Link
                    href={`/category/${child?.slug}`}
                    key={idx}
                    className="group block p-4 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex flex-col items-center text-center">
                      {/* Image Section */}
                      <Image
                         src={`${imageBasePath}/${
                          child?.imageForCategoryProduct || child?.image || child?.imageForHomePage
                        }`}
                        alt={child?.name}
                        width={80}
                        height={80}
                        className="w-20 h-20 object-contain mb-3 transition-transform group-hover:scale-110"
                      />
                      {/* Title Section */}
                      <h3 className="text-sm text-black uppercase font-medium group-hover:text-primary transition-colors duration-300">
                        {child?.name}
                      </h3>
                    </div>
                    {/* Optional: Show Subcategories count or brief information */}
                    {child?.children?.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        <span>{child?.children?.length} Subcategories</span>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </div>
          ) : (
            <Swiper
              spaceBetween={50}
              slidesPerView={1}
              autoplay={{ delay: 3000 }}
              loop={true}
              pagination={true}
              modules={[Pagination, Autoplay]}
              className="mySwiper"
            >
              {slider?.sliderImgs?.length > 0 &&
                slider?.sliderImgs?.map((item, index) => (
                  <SwiperSlide key={index}>
                    <div className="grid grid-cols-1 gap-6 lg:gap-12">
                      <div className="">
                        <div className="w-full h-full">
                          <Image
                            src={`${imageBasePath}/${item?.image}`}
                            alt="banner"
                            height={0}
                            width={0}
                            sizes={100}
                            className="w-full h-[180px] lg:h-[460px] object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
            </Swiper>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
