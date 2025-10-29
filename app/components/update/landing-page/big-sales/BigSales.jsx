"use client";

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProductCard2 from "./ProductCard2";
import { Navigation } from "swiper/modules";
import "swiper/css/navigation"; // import Swiper navigation styles

const BigSales = ({ data }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);

  // Function to find the first item with products
  const findFirstWithProducts = (data) => {
    return data.find((item) => item?.products?.length > 0);
  };

  useEffect(() => {
    if (data?.length > 0) {
      const firstValidItem = findFirstWithProducts(data);
      if (firstValidItem) {
        setSelectedId(firstValidItem._id);
        setSelectedData(firstValidItem);
      }
    }
  }, [data]);


  return (
    <div className="base-container section-gap">
      <p className="text-center uppercase font-medium text-2xl 2xl:text-[32px] text-[#070707] ">
        Big Sales
      </p>

      <div className="flex flex-wrap justify-center mt-6 gap-3 md:gap-6">
        {data?.map(
          (item) =>
            item?.products?.length > 0 && (
              <div key={item?._id}>
                <p
                  className={`${
                    selectedId === item?._id &&
                    "pb-1 border-b border-primary text-[#666666]"
                  } cursor-pointer uppercase text-xs md:text-lg font-normal`}
                  onClick={() => {
                    setSelectedId(item?._id);
                    setSelectedData(item);
                  }}
                >
                  {item?.name}
                </p>
              </div>
            )
        )}
      </div>

      <div className="mt-8">
        <Swiper
          slidesPerView={2}
          spaceBetween={24}
          loop={true}
          navigation={true}
          modules={[Navigation]}
          breakpoints={{
            640: {
              slidesPerView: 2,
              spaceBetween: 24,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 28,
            },
            1280: {
              slidesPerView: 4,
              spaceBetween: 28,
            },
          }}
          className="mySwiper custom-swiper"
        >
          {selectedData?.products?.map((item) => (
            <SwiperSlide key={item?.id}>
              <ProductCard2 item={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default BigSales;
