"use client";

import React from "react";
import Image from "next/image";
import PlaceholderImage from "@/public/image/placeholder_600x.webp";
import Link from "next/link";
import { imageBasePath } from "@/config";
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";

const Categorysection = ({ categoryData }) => {
  return (
    <div className="base-container">
      <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4">
        {categoryData?.map((item, index) => (
          <Link
            href={`/category/${item?.slug}`}
            className="group relative hover:bg-primary rounded-lg   transition duration-300 ease-in-out"
            key={index}
          >
            {item?.image !== "" ? (
              <div className="overflow-hidden rounded-md">
                <Image
                  src={`${imageBasePath}/${item?.image}`}
                  alt="image"
                  width={224}
                  height={224}
                  sizes="100"
                  priority
                  className="object-contain rounded-md group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
            ) : (
              <div className="overflow-hidden rounded-md">
                <Image
                  src={PlaceholderImage}
                  alt="image"
                  width={224}
                  height={224}
                  sizes="100"
                  priority
                  className="object-contain rounded-md group-hover:scale-105 transition-transform duration-300 ease-in-out"
                />
              </div>
            )}

            <div className="w-full text-center my-3">
              <p className="text-black group-hover:text-white px-3 capitalize text-xs font-semibold ">
                {item?.name}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>

    // <div>
    //   <Swiper
    //    slidesPerView={2}
    //     breakpoints={{
    //       640: {
    //         slidesPerView: 2,
    //       },
    //       768: {
    //         slidesPerView: 3,
    //       },
    //       992: {
    //         slidesPerView: 4,
    //       },
    //       1200: {
    //         slidesPerView: 4,
    //       },
    //     }}
    //   >
    //     {categoryData?.map((item) => (
    //       <SwiperSlide
    //         key={item?.id}
    //         className="relative xl:border-r border-black group overflow-hidden"
    //       >
    //         <div className="w-full h-[450px] xl:h-[550px]">
    //           <Image
    //             src={`${imageBasePath}/${item?.image}`}
    //             alt={item?.name}
    //             width={0}
    //             height={0}
    //             sizes="100vw"
    //             className="w-full h-full object-cover transition-transform duration-300 ease-in-out transform group-hover:scale-105"
    //           />
    //         </div>
    //         <div className="absolute inset-0 bg-black opacity-30"></div>{" "}

    //         <Link href={`/category/${item?.slug}`} className="absolute inset-0 cursor-pointer flex flex-col justify-center items-center text-white text-center p-4">
    //           <p className="px-10 py-3 bg-white text-sm text-black font-semibold shadow-md group-hover:bg-secondary transition-colors duration-300 group-hover:text-white capitalize">
    //             {item?.name}
    //           </p>
    //         </Link>
    //       </SwiperSlide>
    //     ))}
    //   </Swiper>
    //  </div>
  );
};

export default Categorysection;
