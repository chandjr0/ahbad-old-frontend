"use client";

import { useStatus } from "@/context/contextStatus";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { BsCart3 } from "react-icons/bs";
import { toast } from "react-toastify";

import { RxCross2 } from "react-icons/rx";
import { BiSearch } from "react-icons/bi";
import postRequest from "@/lib/postRequest";
import Link from "next/link";
import { imageBasePath } from "@/config";
import { getProductImage } from "@/app/utils/getProductImage";
import Image from "next/image";
import BigscreenUserCompo from "./BigscreenUserCompo";

const SmallCartCompo = () => {
  const router = useRouter();

  const { cartItems } = useStatus();

  const [serachboxOpen, setSearchboxOpen] = useState(false);

  const [searchData, setsearchData] = useState([]);

  const [searchKey, setsearchKey] = useState("");

  const wrapperRef = useRef(null);

  const handleSearchClick = () => {
    setSearchboxOpen(!serachboxOpen);
  };

  useEffect(() => {
    function handleClickOutside() {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setsearchData([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  const search = async (val) => {
    setsearchKey(val);
    if (!val.trim()) {
      setsearchData([]);
      return;
    }
    
    const data = {
      value: val,
    };
    
    try {
      let res = await postRequest(
        "product/admin-customer/search?page=1&limit=10",
        data
      );
      
      if (res?.success && res?.data) {
        // Handle both array response and object with data array
        const products = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        setsearchData(products);
      } else {
        setsearchData([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setsearchData([]);
    }
  };

  return (
    <>
      <div className="flex space-x-4 items-center">
        <div
          className="flex items-center space-x-4"
          onClick={handleSearchClick}
        >
          <BiSearch size={22} color="white" />
          {/* <Image
            src="/image/search.png"
            alt="search"
            width={20}
            height={20}
            sizes={100}
            className="cursor-pointer"
          /> */}
        </div>
        {/* <div
          className="cursor-pointer relative mr-3"
          onClick={() => {
            cartItems?.length > 0
              ? router.push(`/checkout`)
              : toast.warning("Cart is Empty");
          }}
        >
          <div className="absolute top-[-13px] right-[-8px] bg-secondary h-[20px] w-[20px] rounded-full flex justify-center items-center">
            <p className="text-white text-xs">{cartItems?.length}</p>
          </div>
          <BsCart3 className="text-secondary" size={22} />
        </div> */}
        {/* <Image
          src="/image/wishlist.png"
          alt="search"
          width={20}
          height={20}
          sizes={100}
          className="cursor-pointer"
        /> */}

        <BigscreenUserCompo />
      </div>
      <div
        className={`${
          serachboxOpen ? " translate-y-[0px]" : "translate-y-[-140px]"
        }  duration-500 absolute top-[0px] left-0 w-full px-3 pt-1 sm:pt-5 pb-4 h-[90px] bg-white`}
      >
        <div
          onClick={handleSearchClick}
          className="cursor-pointer flex justify-end"
        >
          <RxCross2 size={20} color="#DA1C5C" />
        </div>
        <div className="pt-1 relative w-full">
          <input
            placeholder="Looking for something? ...."
            className={`w-full px-4 py-1 bg-[#EBEEEE]  outline-none placeholder:text-sm border border-gray-300`}
            value={searchKey}
            onChange={(e) => search(e.target.value)}
            type="text"
          />

          {searchData?.length ? (
            <div
              className="bg-white w-full h-[300px]  absolute !z-50 overflow-y-auto rounded-b-md shadow-md"
              ref={wrapperRef}
            >
              {searchData?.map((item, index) => (
                <Link
                  href={`/product/${item?.slug}`}
                  key={index}
                  className="space-y-3"
                >
                  <div
                    onClick={() => {
                      setsearchData([]);
                      setsearchKey("");
                    }}
                    key={index}
                    className="m-2 flex items-center justify-start bg-gray-100"
                  >
                    <div className="w-[70px] h-[70px] relative  mr-10">
                      <img
                        alt={item?.name || "Product"}
                        src={getProductImage(item)}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = "/image/placeholder_600x.webp"; }}
                      />
                    </div>
                    <div>
                      <span className="mr-10 text-black text-xs font-semibold">
                        {item?.name?.slice(0, 50)}
                      </span>
                      <div className="flex space-x-2 items-center text-black">
                        {item?.isFlashDeal ? (
                          <>
                            {item?.isVariant == false ? (
                              <>
                                {" "}
                                <p className="text-xs font-semibold text-center">
                                  ৳ {item?.nonVariation?.flashPrice}
                                </p>{" "}
                                <p className="text-xs font-semibold text-center line-through">
                                  TK. {item?.nonVariation?.regularPrice}
                                </p>{" "}
                              </>
                            ) : (
                              <>
                                {" "}
                                <p className="text-xs font-semibold text-center">
                                  ৳ {item?.variations[0]?.flashPrice}
                                </p>
                                <p className="text-xs font-semibold text-center line-through">
                                  TK. {item?.variations[0]?.regularPrice}
                                </p>
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            {item?.isVariant == false ? (
                              <>
                                <p className="text-xs font-semibold text-center">
                                  ৳ {item?.nonVariation?.sellingPrice}
                                </p>
                                <>
                                  {item?.nonVariation?.sellingPrice ==
                                  item?.nonVariation?.regularPrice ? null : (
                                    <p className="text-xs font-semibold text-center line-through">
                                      TK. {item?.nonVariation?.regularPrice}
                                    </p>
                                  )}
                                </>
                              </>
                            ) : (
                              <>
                                <p className="text-xs font-semibold text-center">
                                  ৳ {item?.variations[0]?.sellingPrice}
                                </p>

                                <>
                                  {item?.variations[0]?.sellingPrice ==
                                  item?.variations[0]?.regularPrice ? null : (
                                    <p className="text-xs font-semibold text-center line-through">
                                      TK. {item?.variations[0]?.regularPrice}
                                    </p>
                                  )}
                                </>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default SmallCartCompo;
