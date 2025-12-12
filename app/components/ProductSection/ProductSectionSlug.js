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
  const [productInfo, setProductInfo] = useState(null);
  const [totalProducts, setTotalProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadMoreUsers = async (page = 1, append = false) => {
    try {
      setLoading(true);
      setError(null);
      const productInfoData = await getCategoryWisePro(
        params.params.slug,
        page,
        100
      );
      
      if (productInfoData?.data) {
        setProductInfo(productInfoData);
        if (append) {
          setTotalProducts([...totalProducts, ...(productInfoData?.data?.data || [])]);
        } else {
          setTotalProducts(productInfoData?.data?.data || []);
        }
      } else {
        // Handle empty response
        if (!append) {
          setTotalProducts([]);
          setProductInfo({ data: { data: [], metaData: { totalData: 0 } } });
        }
      }
    } catch (err) {
      console.error("Error loading category products:", err);
      setError("Failed to load products");
      if (!append) {
        setTotalProducts([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMoreUsers(1, false);
  }, [params.params.slug]);

  const handleLoadMore = () => {
    const nextPage = offset + 1;
    setOffset(nextPage);
    loadMoreUsers(nextPage, true);
  };

  return (
    <div>
      {/* Loader - only show on initial load */}
      {loading && totalProducts.length === 0 && (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-xl font-semibold">Loading...</p>
          </div>
        </div>
      )}

      {!loading && totalProducts.length === 0 && !error && (
        <Custom404 />
      )}

      {error && (
        <div className="flex justify-center items-center min-h-[400px]">
          <p className="text-xl font-semibold text-red-600">{error}</p>
        </div>
      )}

      {(totalProducts.length > 0 || (!loading && productInfo)) && (
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
          {totalProducts?.length > 0 && (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-7">
                {totalProducts?.map((item, index) => (
                  <div key={index}>
                    <ProductCard2 item={item} />
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-3 pb-3">
                {productInfo?.data?.metaData?.totalData > totalProducts?.length && (
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="bg-black text-white px-3 py-2 text-[13px] rounded-md disabled:opacity-50"
                  >
                    {loading ? "Loading..." : "See More"}
                  </button>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSectionSlug;
