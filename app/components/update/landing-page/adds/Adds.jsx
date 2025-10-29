import Image from "next/image";
import React from "react";

const Adds = () => {
  const data = [
    {
      id: 1,
      type: "COLLECTION",
      title: "Summer Collection",
      image: "/image/adds1.jpg",
    },
    {
      id: 2,
      type: "FOR SUMMER",
      title: "Trendy Sunglasses 2023",
      image: "/image/adds3.jpg",
    },
    {
      id: 3,
      type: "DISCOUNT",
      title: "-30% for Spring Collection",
      image: "/image/adds2.jpg",
    },
  ];

  return (
    <div className="base-container section-gap">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {data.map((item) => (
          <div key={item.id} className="relative border border-black">
            <div className="w-full  xl:h-[24rem]">
              <Image
                src={item?.image}
                alt={item?.title}
                width={0}
                height={0}
                sizes={100}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center p-4">
              <h3 className="text-sm mb-2">{item.type}</h3>
              <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
              <button className="px-4 py-2 bg-white text-black font-semibold">
                Shop Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Adds;
