"use client";

import { imageBasePath } from "@/config";
import { useStatus } from "@/context/contextStatus";
import React from "react";
import BreadCrumbs from "../components/Common/Breadcumb";
import wishlistEncrypt from "../api/wishlistEncrypt";
import Link from "next/link";

const WishList = () => {
  const { wishlistItems, setWishlistItems } = useStatus();

  const removeItem = (index) => {
    const updatedWishlist = [...wishlistItems];
    updatedWishlist.splice(index, 1);

    if (updatedWishlist.length === 0) {
      setWishlistItems([]);
      localStorage.removeItem("wishlist");
    } else {
      setWishlistItems(updatedWishlist);
      wishlistEncrypt(updatedWishlist); // Update the encrypted wishlist in storage
    }
  };

  const breadCumbs = [
    { name: "Home", url: "/" },
    {
      name: "wishlist",
      // url: "/product-details",
    },
  ];


  return (
    <div>
      <div className="bg-[#E5E7EB]">
        <div className="base-container">
          <div className=" breadcrumbs text-sm !py-3">
            <BreadCrumbs breadCumbs={breadCumbs} />
          </div>
        </div>
      </div>

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4 text-center">Wishlist</h1>
        <div className="bg-gray-200 p-4 rounded shadow-md">
          {wishlistItems && wishlistItems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {wishlistItems?.map((item, index) => (
                <div
                  key={item.productId}
                  className="bg-white rounded shadow p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <button
                      className="text-red-500 font-bold text-xl"
                      onClick={() => removeItem(index)}
                    >
                      ×
                    </button>
                    <Link
                      href={`/product/${item?.slug}`}
                      key={item?.id}
                      className="w-24 h-24 sm:w-16 sm:h-16 rounded overflow-hidden"
                    >
                      <img
                        src={`${imageBasePath}/${item?.image?.[0]}`}
                        alt={item.name}
                        className="object-cover w-full h-full"
                      />
                    </Link>
                    <Link href={`/product/${item?.slug}`} key={item?.id}>
                      <p className="font-semibold text-sm lg:text-base hover:text-orange-600 md:w-[250px] lg:min-w-[400px]">
                        {item?.name} {item?.variation?.attributeOpts?.[0]?.name}
                      </p>
                    </Link>
                  </div>
                  <div className="flex flex-col items-end justify-between min-w-[120px]">
                    <p className="text-red-500 font-bold text-sm sm:text-base">
                      TK {item?.price}
                    </p>
                    {item?.price !== item?.old_price && <p className="line-through text-gray-500 text-xs sm:text-sm">
                      TK {item?.old_price}
                    </p>}

                  </div>
                  {item?.stock > 0 ? <button
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
                    // onClick={() => console.log("Add to cart")}
                  >
                    Stock In
                  </button> : <button
                    className="hover:bg-primary text-white px-4 py-2 rounded bg-orange-600 text-sm"
                    // onClick={() => console.log("Add to cart")}
                  >
                    Stock Out
                  </button>}
                  {/* <button
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-orange-600 text-sm"
                  onClick={() => console.log("Add to cart")}
                >
                  ADD TO CART
                </button> */}
                </div>

              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-4">
              No items in the wishlist.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default WishList;
