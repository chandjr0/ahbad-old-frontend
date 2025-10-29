"use client";

import React, { useState, useEffect, useRef } from "react";
import TopNav from "./TopNav";
import NavMenu from "./NavMenu";
import SmallscreenSearchCompo from "../../Layout/Header/SmallscreenSearchCompo";

const NavbarMain = () => {
  const menu = [
    { name: "Home", slug: "/" },
    // { name: "Flash Sale" },
    { name: "All Brands", slug: "/brands" },
    // { name: "Coupons" },
    { name: "About Us", slug: "/about-us" },
    { name: "Combo", slug: "/combo-products" },
    // { name: "Re Stock Product" },
  ];

  const [navData, setNavData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);

  const navbarRef = useRef(null); // Reference to the navbar element

  useEffect(() => {
    // Event listener for clicks outside the navbar
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setShowSearchBar(false); // Hide the search bar if clicked outside
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCloseSearch = () => {
    setShowSearchBar(false);
  };

  return (
    <div className="bg-white text-black sticky top-0 left-0 right-0 z-40" ref={navbarRef}>
      <TopNav menu={menu} setShowSearchBar={setShowSearchBar} showSearchBar={showSearchBar} />
      <NavMenu menu={menu} />
      {showSearchBar && (
        <div className="z-50">
          <SmallscreenSearchCompo onClose={handleCloseSearch} />
        </div>
      )}
    </div>
  );
};

export default NavbarMain;
