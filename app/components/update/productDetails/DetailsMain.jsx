"use client";

import React from "react";
import ProductDetails from "./ProductDetails";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import ProductCard from "../landing-page/big-sales/ProductCard";
import ProductDetails2 from "./ProdutDetails2";
import ProductCard2 from "../landing-page/big-sales/ProductCard2";

const DetailsMain = ({ info }) => {

  return (
    <div className="pb-8">
      <ProductDetails2 info={info} />

      <div className="base-container mt-20">
        <div className="flex justify-between items-center">
          <p className="text-title ">Similar Products</p>
        </div>
        <div className="mt-[45px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 ">
          {info?.similarProducts?.map((item, index) => (
            <ProductCard2 key={index} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsMain;
