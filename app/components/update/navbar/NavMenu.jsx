import { useStatus } from "@/context/contextStatus";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState } from "react";
import { set } from "react-hook-form";
import HeroSection from "../landing-page/hero-section/HeroSection";

const NavMenu = ({ menu }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { setSideCategory } = useStatus();
  const [showHeroSection, setShowHeroSection] = useState(false); 
  const pathname = usePathname();

  // Check if the current page is the home page
  const isHomePage = pathname === "/";

  // Handle mouse leave on HeroSection to hide it
  const handleHeroSectionMouseLeave = () => {
    setShowHeroSection(false);
  };
  
  // Toggle HeroSection on click
  const handleCategoryClick = () => {
    setShowHeroSection((prev) => !prev);
  };

  return (
    <div className="bg-primary">
      <div className=" base-container   text-white  hidden lg:block">
        <div className="grid grid-cols-12 ">
        <div
            className="col-span-2 bg-[#a6a6bd23] p-3 cursor-pointer"
            onClick={handleCategoryClick}
          >
            <h3 className="text-base font-semibold">Categories</h3>

            {showHeroSection && (
              <div className="absolute left-0 top-[132px] z-[9999] w-full"
              onMouseLeave={handleHeroSectionMouseLeave}>
                <HeroSection  /> {/* Handle HeroSection mouse leave */}
              </div>
            )}
          </div>
          <div className="col-span-10 p-3 ">
            <div className="flex  items-center gap-6">
              {menu.map((item, index) => (
                item.slug ? (
                  // Render as link if slug exists
                  <Link href={item.slug} 
                    key={index}
                    className="relative flex items-center group cursor-pointer"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <h3 className="text-[12px] font-semibold group-hover:text-orange-600">{item.name}</h3>
                    {item.children && (
                      <i className="ri-arrow-down-s-line text-white text-sm ml-1"></i>
                    )}

                    {item.children && hoveredIndex === index && (
                      <div className="absolute left-0 top-0 z-10 ">
                        <div className="bg-white shadow-md p-3 mt-8 !w-[10rem]">
                          <ul className="space-y-2">
                            {item.children.map((child, childIndex) => (
                              <li
                                key={childIndex}
                                className="text-sm text-gray-700 hover:text-[#FC5F49] cursor-pointer"
                              >
                                {child.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </Link>
                ) : (
                  // Render as plain text if no slug
                  <div 
                    key={index}
                    className="relative flex items-center group cursor-default"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <h3 className="text-[12px] font-semibold group-hover:text-orange-600">{item.name}</h3>
                    {item.children && (
                      <i className="ri-arrow-down-s-line text-white text-sm ml-1"></i>
                    )}

                    {item.children && hoveredIndex === index && (
                      <div className="absolute left-0 top-0 z-10 ">
                        <div className="bg-white shadow-md p-3 mt-8 !w-[10rem]">
                          <ul className="space-y-2">
                            {item.children.map((child, childIndex) => (
                              <li
                                key={childIndex}
                                className="text-sm text-gray-700 hover:text-[#FC5F49] cursor-pointer"
                              >
                                {child.name}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavMenu;
