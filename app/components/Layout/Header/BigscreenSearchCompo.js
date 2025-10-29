"use client";

import { hostname } from "@/config";
import postRequest from "@/lib/postRequest";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";

const BigscreenSearchCompo = () => {
  const [searchData, setsearchData] = useState([]);
  const [searchKey, setsearchKey] = useState("");
  const wrapperRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event) {
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
      
      if (res?.success) {
        setsearchData(res?.data || []);
      } else {
        setsearchData([]);
      }
    } catch (error) {
      console.error("Search error:", error);
      setsearchData([]);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchKey.trim()) {
      // Close the search dropdown
      setsearchData([]);
      // Navigate to search results page with the query
      router.push(`/search?q=${encodeURIComponent(searchKey)}`);
    }
  };

  return (
    <div className="relative">
      <form onSubmit={handleSearchSubmit} className="relative w-full mx-auto">
        <input
          type="text"
          placeholder="I am shopping for..."
          value={searchKey}
          onChange={(e) => search(e.target.value)}
          className="input input-bordered w-full rounded-full bg-white shadow border-black focus:outline-none focus:ring-2 focus:ring-primary pr-12 placeholder:text-sm"
        />
        <button 
          type="submit" 
          className="absolute top-1/2 right-4 transform -translate-y-1/2 btn btn-ghost p-0"
        >
          <FiSearch className="w-5 h-5 stroke-current" />
        </button>
      </form>

      {searchData?.length > 0 && (
        <div
          className="bg-white w-full max-h-[400px] absolute z-10 overflow-y-auto rounded-b-md shadow-md"
          ref={wrapperRef}
        >
          {searchData.map((item, index) => (
            <Link
              href={`/product/${item?.slug}`}
              key={item?._id || index}
              className="block hover:bg-gray-50"
              onClick={() => {
                setsearchData([]);
                setsearchKey("");
              }}
            >
              <div className="p-3 flex items-center border-b">
                <div className="w-[70px] h-[70px] relative mr-3 flex-shrink-0">
                  <Image
                    alt={item?.name || "Product image"}
                    fill
                    src={`${hostname}/${item?.galleryImage[0]}`}
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-gray-900">
                    {item?.name?.slice(0, 50)}
                  </h3>
                  <div className="flex items-center mt-1">
                    {item?.isFlashDeal ? (
                      <>
                        {item?.isVariant === false ? (
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold">
                              ৳ {item?.nonVariation?.flashPrice}
                            </p>
                            <p className="text-xs line-through">
                              ৳ {item?.nonVariation?.regularPrice}
                            </p>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold">
                              ৳ {item?.variations[0]?.flashPrice}
                            </p>
                            <p className="text-xs line-through">
                              ৳ {item?.variations[0]?.regularPrice}
                            </p>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {item?.isVariant === false ? (
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold">
                              ৳ {item?.nonVariation?.sellingPrice}
                            </p>
                            {item?.nonVariation?.sellingPrice !== item?.nonVariation?.regularPrice && (
                              <p className="text-xs line-through">
                                ৳ {item?.nonVariation?.regularPrice}
                              </p>
                            )}
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <p className="text-sm font-semibold">
                              ৳ {item?.variations[0]?.sellingPrice}
                            </p>
                            {item?.variations[0]?.sellingPrice !== item?.variations[0]?.regularPrice && (
                              <p className="text-xs line-through">
                                ৳ {item?.variations[0]?.regularPrice}
                              </p>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
          
          {/* "See all results" button */}
          <div className="p-3 bg-gray-50">
            <button 
              onClick={handleSearchSubmit}
              className="w-full py-2 bg-secondary hover:bg-secondary-dark text-white text-sm rounded transition-colors duration-200"
            >
              See all results for &quot;{searchKey}&quot;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BigscreenSearchCompo;
