import { imageBasePath } from "@/config";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// CategoryImage Component to avoid repetition
const CategoryImage = ({ image, name, aspectRatio, slug }) => {
  return (
    <Link href={`/category/${slug}`}>
    <div className="image-zoom relative">
      <Image
        src={`${imageBasePath}/${image}`}
        width={0}
        height={0}
        alt="image"
        sizes="100vw" // Adjusted to allow responsive behavior
        className={`w-full h-full ${aspectRatio}`}
      />
      <div className="absolute inset-x-0 top-1/2 h-1/2 bg-gradient-to-b from-transparent to-black opacity-50"></div>
      <p className="absolute capitalize bottom-2 left-1/2 transform -translate-x-1/2 text-center text-white text-[12px] md:text-lg font-bold p-1 rounded z-10">
        {name}
      </p>
    </div>
  </Link>
  );
};

const FeaturedCategory = ({ data }) => {
  return (
    <div className="base-container section-gap pb-12">
      <p className="text-center text-title">FEATURE CATEGORY</p>

      <div className="mt-10">
        <div className="grid grid-cols-12 gap-3 md:gap-6">
          <div className="col-span-12 md:col-span-3">
            <div className="flex flex-col gap-3 md:gap-6">
              {/* Using CategoryImage component */}
              <CategoryImage
                image={data[0]?.image}
                name={data[0]?.name}
                aspectRatio="aspect-[1.9/1] md:aspect-[1.6/1]"
                slug={data[0]?.slug}
              />
              <CategoryImage
                image={data[1]?.image}
                name={data[1]?.name}
                aspectRatio="aspect-[1.9/1] md:aspect-[1.6/1]"
                slug={data[1]?.slug}
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-6">
            <CategoryImage
              image={data[3]?.image}
              name={data[3]?.name}
              aspectRatio="aspect-[1.57/1]"
              slug={data[3]?.slug}
            />
          </div>

          <div className="col-span-12 md:col-span-3">
            <div className="flex flex-col gap-3 md:gap-6">
              <CategoryImage
                image={data[2]?.image}
                name={data[2]?.name}
                aspectRatio="aspect-[1.9/1] md:aspect-[1.6/1]"
                slug={data[2]?.slug}
              />
              <CategoryImage
                image={data[4]?.image}
                name={data[4]?.name}
                aspectRatio="aspect-[1.9/1] md:aspect-[1.6/1]"
                slug={data[4]?.slug}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCategory;
