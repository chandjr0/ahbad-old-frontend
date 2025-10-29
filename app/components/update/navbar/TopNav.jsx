import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import SideCart from "./SideCart";
import { useStatus } from "@/context/contextStatus";
import { imageBasePath } from "@/config";
import decryptData from "@/app/api/decrypt";
import BigscreenUserCompo from "../../Layout/Header/BigscreenUserCompo";
import BigscreenSearchCompo from "../../Layout/Header/BigscreenSearchCompo";
import SmallscreenSearchCompo from "../../Layout/Header/SmallscreenSearchCompo";

const TopNav = ({ setShowSearchBar, showSearchBar }) => {
  const { siteView, wishlistItems, setSideCategory } = useStatus();
  const [subTotal, setSubTotal] = useState(0);
  const { cartItems } = useStatus();

  useEffect(() => {
    let total = 0;
    if (cartItems && cartItems.length > 0) {
      total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    }
    setSubTotal(total);
  }, [cartItems]);

  return (
    <div className="base-container relative">

      {/* Top Navigation Bar */}
      <div className={`py-4 transition-opacity `}>
        <div className="navbar !p-0 !min-h-0">
          {/* Navbar Start */}
          <div className="navbar-start flex gap-2">
            <div 
            onClick={() => {
              setSideCategory(true);
            }}
            className="lg:hidden"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <Link href="/">
              <Image
                src={`${imageBasePath}/${siteView?.logoImg}`}
                width={159}
                height={51}
                alt="logo image"
                className="w-[124px] md:w-[159px] h-[40px] md:h-[51px]"
              />
            </Link>
          </div>

          {/* Navbar Center */}
          <div className="navbar-center hidden lg:block w-full max-w-3xl px-4">
            <BigscreenSearchCompo />
          </div>

          {/* Navbar End */}
          <div className="navbar-end !pl-3 pr-2">
            <div className="flex gap-3">
              {/* Search Icon (Click to show SmallscreenSearchCompo) */}
              <div onClick={() => setShowSearchBar(!showSearchBar)} className="cursor-pointer block lg:hidden">
                <i className="text-lg ri-search-line"></i>
              </div>

              {/* Wishlist Icon */}
              <Link href="/wishlist">
                <div className="relative cursor-pointer">
                  <i className="text-lg ri-heart-3-line"></i>
                  <p className="absolute -top-1 -right-2 bg-[#FC5F49] h-4 w-4 rounded-full text-center text-[12px] text-white">
                    {wishlistItems?.length || 0}
                  </p>
                </div>
              </Link>

              {/* User Component (Shown on larger screens) */}
              <p className="hidden md:block">
                <BigscreenUserCompo />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNav;
