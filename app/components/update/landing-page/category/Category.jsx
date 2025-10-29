import Image from "next/image";
import React from "react";

const Category = () => {
  const data = [
    {
      id: 1,
      name: "Women",
      image: "/image/cat1.jpg",
    },
    {
      id: 2,
      name: "Men",
      image: "/image/cat2.jpg",
    },
    {
      id: 3,
      name: "Kids",
      image: "/image/cat3.jpg",
    },
    {
      id: 4,
      name: "Accessories",
      image: "/image/cat4.jpg",
    },
  ];
  return (
    <div className="base-container section-gap">
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {data.map((item) => (
          <div key={item?.id} className="relative xl:border-r border-black">
            <div className="w-full h-[450px] xl:h-[550px]">
              <Image
                src={item?.image}
                alt={item?.name}
                width={0}
                height={0}
                sizes={100}
                className="w-full h-full object-cover "
              />
            </div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center p-4">
              <p className="px-10 py-3 bg-white text-sm text-black font-semibold">
                {item?.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
