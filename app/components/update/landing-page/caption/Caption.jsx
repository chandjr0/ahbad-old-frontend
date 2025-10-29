import Image from "next/image";
import React from "react";

const Caption = () => {
  return (
    <div className="relative">
      <div className="flex justify-center">
        <Image 
          src="/image/bg-caption.png"
          width={0}
          height={0}
          alt="caption"
          sizes={100}
          className=" w-[250px] h-[200px] md:w-[300px] md:h-[200px] lg:w-[400px] lg:h-[250px] 2xl:w-[550px] 2xl:h-[350px]"
        />
      </div>

      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
        <p className="px-4 text-lg   md:text-2xl md:px-12 lg:px-28 lg:text-[30px] 2xl:text-[44px] 2xl:px-40 lg:leading-10 xl:leading-10 2xl:leading-normal font-medium text-center text-[#070707]">
          We believe that every human deserves to feel beautiful and confident, 
          and we are committed to providing you with the best quality and styles 
          that will make you look and feel your best.
        </p>
      </div>
    </div>
  );
};

export default Caption;
