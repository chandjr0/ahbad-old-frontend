import Image from "next/image";
import React from "react";

const ReviewCard = () => {
  return (
    <div className="px-6 py-12 ">
      <div className="grid grid-cols-12 items-center gap-6">
        <div className="col-span-3">
          <Image
            height={0}
            width={0}
            sizes={100}
            src="/image/review1.jpg" // Adjust the image path accordingly
            alt="reviewer image"
            className="w-full h-full rounded-full object-cover border border-gray-300"
          />
        </div>
        <div className="col-span-9">
          <p className="text-gray-600 mb-2">
            I am a regular at this fashion shop - their stylish clothes and accessories always keep me ahead of the trend.
          </p>
          <h6 className="font-semibold text-black">Katrin McWell, Forbes</h6>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
