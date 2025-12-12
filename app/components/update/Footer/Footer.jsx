"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  FaFacebook,
  FaWhatsapp,
  FaYoutube,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import PaymentGatewayImage from "@/public/image/payments.jpeg";
import Link from "next/link";
import { useStatus } from "@/context/contextStatus";
import request from "@/lib/request";
import { setCookie } from "nookies";
import { imageBasePath } from "@/config";
import { toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";
import { IoBagCheckOutline, IoCallOutline, IoLocation } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";
import { IoIosArrowRoundUp } from "react-icons/io";
import { AiFillTikTok } from "react-icons/ai";
import { TbCategoryPlus } from "react-icons/tb";
import { HiTruck } from "react-icons/hi";

import "../../../custom.css";
import { usePathname, useRouter } from "next/navigation";
import SideCart from "../navbar/SideCart";
import FooterContact from "./FooterContact";
import FooterLinks from "./FooterLinks";
import { FiUser } from "react-icons/fi";
import StickyContactBar from "./StickyContactBar";
import { SiGmail } from "react-icons/si";

let fullUrl;

if (typeof window !== "undefined") {
  fullUrl = window.location.href;
}
export default function Footer() {
  const {
    settingsData,
    setSettingsData,
    token,
    cartItems,
    setSideCategory,
    setProfileMenu,
  } = useStatus();
  const [subTotal, setSubTotal] = useState(0);

  const pathname = usePathname();
  const router = useRouter();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [openIndex, setOpenIndex] = useState([]);
  const [pagesView, setPagesView] = useState([]);

  const handleAccordionClick = (index) => {
    if (openIndex.includes(index)) {
      setOpenIndex(openIndex.filter((i) => i !== index));
    } else {
      setOpenIndex([...openIndex, index]);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 700) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  function getFbclidFromUrl(url) {
    var params = new URLSearchParams(new URL(url).search);
    return params.get("fbclid");
  }

  useEffect(() => {
    getData();
    getPageData();
  }, []);

  const getData = async () => {
    const res = await request(`setting/admin/site-view`);
    if (res) {
      if (getFbclidFromUrl(fullUrl)) {
        setCookie(
          null,
          "fbClickId",
          JSON.stringify(getFbclidFromUrl(fullUrl)),
          {
            path: "/",
            expires: 0,
          }
        );
      }

      localStorage.setItem("settings", JSON.stringify(res?.data?.data));
      setSettingsData(res?.data?.data);
    }
  };

  const getPageData = async () => {
    const res = await request(`setting/admin/pages-view`);
    if (res) {
      setPagesView(res?.data?.data?.pages);
    }
  };

  const handleLinkClickFb = () => {
    const url = `${settingsData?.socialLinks?.facebook}`;
    window.open(url, "_blank");
  };
  const handleLinkClickWhats = () => {
    const url = `${settingsData?.socialLinks?.whatsapp}`;
    window.open(url, "_blank");
  };
  const handleLinkClickYou = () => {
    const url = `${settingsData?.socialLinks?.youtube}`;
    window.open(url, "_blank");
  };
  const handleLinkClickInsta = () => {
    const url = `${settingsData?.socialLinks?.instagram}`;
    window.open(url, "_blank");
  };
  const handleLinkClickTiktok = () => {
    const url = `${settingsData?.socialLinks?.tiktok}`;
    window.open(url, "_blank");
  };

  const handleCloseDrawer = () => {
    const drawerCheckbox = document.getElementById("my-drawer-4");
    if (drawerCheckbox) {
      drawerCheckbox.checked = false;
    }
  };

  useEffect(() => {
    let total = 0;
    if (cartItems && cartItems.length > 0) {
      total = cartItems.reduce((accumulator, item) => {
        return accumulator + item.price * item.quantity;
      }, 0);
    }
    setSubTotal(total);
  }, [cartItems]);

  const handleProfileRoute = () => {
    setProfileMenu(true);
  };

  const handleCheckoutClick = () => {
    if (cartItems?.length > 0) {
      router.push("/checkout");
    } else {
      toast.error("You have no items in your cart, Please add to cart.");
    }
  };

  return (
    <div className="">
      <StickyContactBar settingsData={settingsData} />

      <div className="bg-[#262D34] border-t-[5px] border-primary">
        <div className="base-container py-6 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-white">
              <div className="flex justify-center md:justify-start">
                <Image
                  src={`/image/header-logo.png`}
                  width={0}
                  height={0}
                  alt="logo image"
                  sizes={100}
                  className="w-[159px] h-[40px] md:h-[51px]"
                />
              </div>

              <div className="mt-6">
                <div className="flex items-start gap-2 mb-2">
                  <div className="mt-[2px]">
                    <IoLocation className="text-red-500" />
                  </div>
                  <p className="text-sm">
                    {settingsData?.address?.district}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div>
                    <SiGmail className="text-red-500" />
                  </div>
                  <p className="text-sm">
                    {settingsData?.email}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <IoCallOutline className="text-red-500" />
                  </div>
                  <p className="text-sm">
                    {settingsData?.phone}
                  </p>
                </div>
              </div>

              <div className="flex justify-center md:justify-start space-x-3 items-center mt-5">
                {settingsData?.socialLinks?.facebook ? (
                  <div
                    onClick={() => handleLinkClickFb()}
                    className="cursor-pointer"
                  >
                    <FaFacebook className="text-white text-xl hover:text-primary" />
                  </div>
                ) : null}

                {settingsData?.socialLinks?.youtube ? (
                  <div
                    onClick={() => handleLinkClickYou()}
                    className="cursor-pointer"
                  >
                    <FaYoutube className="text-white text-xl hover:text-primary" />
                  </div>
                ) : null}

                {settingsData?.socialLinks?.whatsapp ? (
                  <div
                    onClick={() => handleLinkClickWhats()}
                    className="cursor-pointer"
                  >
                    <FaWhatsapp className="text-white text-xl hover:text-primary" />
                  </div>
                ) : null}

                {settingsData?.socialLinks?.instagram ? (
                  <div
                    onClick={() => handleLinkClickInsta()}
                    className="cursor-pointer"
                  >
                    <FaInstagram className="text-white text-xl hover:text-primary" />
                  </div>
                ) : null}

                {settingsData?.socialLinks?.tiktok ? (
                  <div
                    onClick={() => handleLinkClickTiktok()}
                    className="cursor-pointer"
                  >
                    <FaTiktok className="text-white text-xl hover:text-primary" />
                  </div>
                ) : null}
              </div>
            </div>

            <div className="text-white">
              <h3 className="text-xl font-semibold mb-4">Shop Address</h3>

              <div className="mt-6">
                <div className="flex items-start gap-2 mb-2">
                  <div className="mt-[2px]">
                    <IoLocation className="text-red-500" />
                  </div>
                  <p className="text-sm">
                    {settingsData?.address?.district}
                  </p>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div>
                    <SiGmail className="text-red-500" />
                  </div>
                  <p className="text-sm">
                    {settingsData?.email}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div>
                    <IoCallOutline className="text-red-500" />

                  </div>
                  <p className="text-sm">
                    {settingsData?.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-white">
              <h3 className="text-xl font-semibold mb-4">Policies</h3>
              <ul className="mt-4 space-y-3">

                <li>
                  <Link href="/refund-and-returned">
                    <p className="text-sm font-semibold text-white hover:text-orange-600 duration-300">
                      Refund & Returned
                    </p>
                  </Link>
                </li>

                <li>
                  <Link href="/about-us">
                    <p className="text-sm font-semibold text-white hover:text-orange-600 duration-300">
                      About Us
                    </p>
                  </Link>
                </li>

                <li>
                  <Link href="/privacy-policy">
                    <p className="text-sm font-semibold text-white hover:text-orange-600 duration-300">
                      Privacy Policy
                    </p>
                  </Link>
                </li>

                <li>
                  <Link href="/terms-and-conditions">
                    <p className="text-sm font-semibold text-white hover:text-orange-600 duration-300">
                      Terms & Conditions
                    </p>
                  </Link>
                </li>
                {/* <li>
        <div href="/showroom-list">
          {" "}
          <p className="text-sm font-semibold text-white hover:text-orange-600 duration-300">
            blog
          </p>
        </div>
      </li> */}
              </ul>
            </div>
          </div>
        </div>

        {showScrollTop && (
          <div
            className="fixed right-[1rem] bottom-20 md:bottom-16 bg-primary rounded-full p-3 cursor-pointer"
            onClick={scrollToTop}
          >
            <IoIosArrowRoundUp color="white" size={25} />
          </div>
        )}
      </div>

      <div className="bg-[#323538]">
        <div className="base-container py-4 flex justify-center">
          <Image
            src="/image/SSLCommerz.png"
            alt="payment methods"
            width={0}
            height={0}
            sizes={100}
            className="w-[992px] h-full"
          />
        </div>
      </div>

      <div className="bg-white text-black pb-28 md:pb-0">
        <div className="base-container py-2">
          <div className="grid grid-cols-12">
            <div className="col-span-1"></div>
            <div className="col-span-10">
              <div className="flex flex-col gap-2 md:flex-row md:justify-between items-center">
                <p className="text-base">© All Rights Reserve by Ahbab</p>
                <div>
                  <Link
                    href="http://storex.com.bd/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center gap-2"
                  >
                    <p className="text-[#4D4D4D]">Powered By - </p>
                    <Image
                      src={`/image/storex-logo.png`}
                      width={0}
                      height={0}
                      alt="logo image"
                      sizes={100}
                      className="w-[139px] h-[40px] md:h-[45px]"
                    />
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-span-1"></div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 w-full z-50">
        <div className="relative bg-primary text-white flex justify-around items-center py-2">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => {
              setSideCategory(true);
            }}
          >
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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
            <p className="text-[10px] mt-1">Menu</p>
          </div>
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => {
              setSideCategory(true);
            }}
          >
            <div>
              <TbCategoryPlus />
            </div>
            <p className="text-[10px] mt-1">Categories</p>
          </div>
          <Link
            href="/"
            className={`rounded-full bg-white shadow ${pathname.includes("/product")
                ? "border-4 border-[#EB7F25] w-10 h-10"
                : "-mt-10 border-4 border-[#EB7F25] w-16 h-16"
              } flex items-center justify-center`}
          >
            <img
              src="/image/footer-middle-logo.png"
              alt="Logo"
              className={`rounded-full ${pathname.includes("/product") ? "w-8 h-8" : "w-12 h-12"
                }`}
            />
          </Link>
          <div className="flex flex-col items-center">
            <div>
              <HiTruck />
            </div>
            <p className="text-[10px] mt-1">Tracking</p>
          </div>
          {token ? (
            <Link href="/users/profile" className="flex flex-col items-center">
              <div>
                <FiUser size={20} />
            </div>
            <p className="text-[10px] mt-1">Profile</p>
          </Link>
          ) : (
            <Link href="/users/login" className="flex flex-col items-center">
              <div>
                <FiUser size={20} />
              </div>
              <p className="text-[10px] mt-1">Login</p>
            </Link>
          )}
        </div>
      </div>

      {pathname !== "/checkout" && cartItems?.length > 0 && (
        <div className="container max-w-[1600px] mx-auto relative">
          <div className="drawer-content">
            <label htmlFor="my-drawer-4">
              <div className="fixed top-1/2 right-0 transform -translate-y-20 !z-30 w-16 md:w-20 shadow-lg group cursor-pointer ">
                <div className="bg-orange-500 group-hover:bg-primary">
                  <div className="flex flex-col items-center justify-center py-1">
                    <i className="text-lg md:text-2xl ri-shopping-cart-2-line text-white"></i>
                    <p className="text-white font-bold uppercase text-[10px] md:text-[12px]">
                      {cartItems?.length || 0} Items
                    </p>
                  </div>
                </div>
                <div className="bg-white text-center text-[10px] md:text-[12px] py-2">
                  <p className="text-[#636262] font-bold">৳{subTotal}</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      )}

      <div className="drawer drawer-end">
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />

        <div className="drawer-side z-[999]">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="bg-white min-h-full w-[21rem] p-4 flex flex-col justify-between">
            <div className="flex-1 ">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Cart</h3>
                <button onClick={handleCloseDrawer}>
                  <i className="ri-close-line text-2xl text-red-600"></i>
                </button>
              </div>

              <div className="">
                <SideCart cartItems={cartItems} />
              </div>
            </div>

            <div className="border-t border-gray-200 py-2 mt-4 sticky bottom-0 bg-white">
              <div className="flex justify-between items-center border-dashed border-b-2 border-[#c3c1c1] py-1">
                <p className="text-sm font-medium">Subtotal:</p>
                <p className="text-sm font-semibold">Tk {subTotal}</p>
              </div>
              <div className="flex justify-between items-center mb-4">
                <p className="text-lg font-semibold">Total:</p>
                <p className="text-lg font-semibold">Tk {subTotal}</p>
              </div>
              <Link href="/checkout" onClick={handleCloseDrawer}>
                <button className="w-full bg-primary hover:bg-primary text-white py-2 ">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}