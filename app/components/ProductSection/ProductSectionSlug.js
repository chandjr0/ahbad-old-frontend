"use client";
import React, { useState, useEffect } from "react";
import Custom404 from "../Custom404";
import { getCategoryWisePro } from "@/app/components/actions/getCategoryWisePro";
import ProductCard2 from "../update/landing-page/big-sales/ProductCard2";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { imageBasePath } from "@/config";
import PlaceholderImage from "@/public/image/placeholder_600x.webp";

const ProductSectionSlug = ({ params }) => {
  const [offset, setOffset] = useState(1);
  const [productInfo, setProductInfo] = useState({});
  const [totalProducts, setTotalProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMoreUsers = async () => {
    setLoading(true);
    const productInfoData = await getCategoryWisePro(
      params.params.slug,
      offset,
      100
    );
    setProductInfo(productInfoData);
    setTotalProducts([...totalProducts, ...productInfoData?.data?.data]);
    setOffset(offset + 1);
    setLoading(false);
  };

  useEffect(() => {
    loadMoreUsers();
  }, []);

  return (
    <div>
      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center min-h-screen">
          <p className="text-xl font-semibold">Loading...</p>
        </div>
      )}

      {!loading && (
        <>
          {/* Category Swiper */}
          {productInfo?.data?.categoriesInfo?.categoriesWiseSubcategories?.length > 0 && (
            <div className="my-4 lg:my-8">
              <div className="shadow rounded-lg p-1 lg:p-6">
                <Swiper
                  slidesPerView={4}
                  spaceBetween={15}
                  autoplay={{ delay: 3000 }}
                  loop={true}
                  modules={[Pagination, Autoplay]}
                  breakpoints={{
                    640: { slidesPerView: 5 },
                    768: { slidesPerView: 6 },
                    992: { slidesPerView: 8 },
                    1200: { slidesPerView: 9 },
                  }}
                  className="category-swiper"
                >
                  {productInfo?.data?.categoriesInfo?.categoriesWiseSubcategories?.map(
                    (item) => (
                      <SwiperSlide key={item?.id} className="group overflow-hidden">
                        <Link
                          href={`/category/${item?.slug}`}
                          className="group relative hover:bg-primary rounded-lg transition duration-300 ease-in-out"
                        >
                          <div className="overflow-hidden rounded-md border border-gray-300 shadow-lg group-hover:shadow-xl transition-shadow duration-300 ease-in-out">
                            <Image
                              src={
                                item?.image
                                  ? `${imageBasePath}/${item?.image}`
                                  : PlaceholderImage
                              }
                              alt={item?.name || "Category Image"}
                              width={224}
                              height={224}
                              priority
                              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300 ease-in-out"
                            />
                          </div>
                          <div className="w-full text-center my-3">
                            <p className="text-black px-3 capitalize text-xs font-semibold">
                              {item?.name}
                            </p>
                          </div>
                        </Link>
                      </SwiperSlide>
                    )
                  )}
                </Swiper>
              </div>
            </div>
          )}

          {/* Products */}
          {totalProducts?.length > 0 ? (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-7">
                {totalProducts?.map((item, index) => (
                  <div key={index}>
                    <ProductCard2 item={item} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-3 pb-3">
                {productInfo?.data?.metaData?.totalData !== totalProducts?.length && (
                  <button
                    onClick={loadMoreUsers}
                    className="bg-black text-white px-3 py-2 text-[13px] rounded-md"
                  >
                    See More
                  </button>
                )}
              </div>
            </>
          ) : (
            <Custom404 />
          )}
        </>
      )}
    </div>
  );
};

export default ProductSectionSlug;
