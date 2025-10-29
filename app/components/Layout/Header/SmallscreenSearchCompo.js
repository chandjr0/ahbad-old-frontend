"use client";

import { hostname } from "@/config";
import postRequest from "@/lib/postRequest";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { FiSearch } from "react-icons/fi";

const SmallscreenSearchCompo = ({ onClose }) => {
  const [searchData, setsearchData] = useState([]);
  const [searchKey, setsearchKey] = useState("");
  const wrapperRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    // Auto-focus the search input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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
      // Close the search dropdown and search component
      setsearchData([]);
      if (onClose) onClose();
      
      // Navigate to search results page with the query
      router.push(`/search?q=${encodeURIComponent(searchKey)}`);
    }
  };

  return (
    <div className="relative px-5 pb-2">
      <form onSubmit={handleSearchSubmit} className="flex items-center">
        <input
          ref={inputRef}
          className="w-full py-2 outline-none pl-4 border border-secondary placeholder:text-sm placeholder:text-black rounded-l-lg"
          placeholder="Search for products..."
          onChange={(e) => search(e.target.value)}
          type="text"
          value={searchKey}
        />
        <button 
          type="submit"
          className="px-4 h-[40px] flex justify-center items-center bg-secondary hover:bg-secondary-dark transition-colors duration-300 rounded-r-lg"
        >
          <FiSearch className="h-5 w-5 text-white" />
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
                if (onClose) onClose();
              }}
            >
              <div className="p-2 flex items-center border-b">
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
        </div>
      )}
    </div>
  );
};

export default SmallscreenSearchCompo;
