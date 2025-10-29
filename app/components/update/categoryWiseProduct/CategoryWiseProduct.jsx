"use client"

import React from "react";
import ProductCard from "../landing-page/big-sales/ProductCard";
import Link from "next/link";
import ProductCard2 from "../landing-page/big-sales/ProductCard2";

const CategoryWiseProduct = ({ title, slug, item, type }) => {



  return (
    <div className="base-container section-gap py-4">
     <div className="bg-white">
     <div className="flex justify-between items-center bg-primary  shadow p-4">
        <p className="text-title !text-white ">
          {title}
        </p>
        <Link href={`${type ? `/${slug}` : `/category/${slug}` }`} className="text-base text-white font-semibold border-b border-primary">
          See All
        </Link>
      </div>
      <div className="py-6 mx-[1px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 ">
        {item?.slice(0,12)?.map((item, index) => (
              <ProductCard2 key={index} item={item} type={type} />
        ))}
      </div>
     </div>
    </div>
  );
};

export default CategoryWiseProduct;
