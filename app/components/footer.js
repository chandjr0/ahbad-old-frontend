"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { FaFacebook, FaWhatsapp, FaYoutube, FaInstagram } from "react-icons/fa";
import PaymentGatewayImage from "@/public/image/payments.jpeg";
import Link from "next/link";
import { useStatus } from "@/context/contextStatus";
import request from "@/lib/request";
import { setCookie } from "nookies";
import { imageBasePath } from "@/config";
import SideCart from "./update/navbar/SideCart";
import { toast } from "react-toastify";
import { CgProfile } from "react-icons/cg";
import { IoBagCheckOutline } from "react-icons/io5";
import { FaPhone } from "react-icons/fa";

import "../custom.css";
import { usePathname, useRouter } from "next/navigation";


let fullUrl;

if (typeof window !== "undefined") {
  fullUrl = window.location.href;
}
export default function Footer() {
  const { settingsData, setSettingsData, token, cartItems, setSideCategory, setProfileMenu } =
    useStatus();
  const [subTotal, setSubTotal] = useState(0);

  const pathname = usePathname();
  const router = useRouter();


  function getFbclidFromUrl(url) {
    var params = new URLSearchParams(new URL(url).search);
    return params.get("fbclid");
  }

  useEffect(() => {
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
              // maxAge : 60 * 60
            }
          );
        }

        localStorage.setItem("settings", JSON.stringify(res?.data?.data));

        setSettingsData(res?.data?.data);
      }
    };
    getData();
  }, []);

  const handleLinkClickFb = () => {
    const url = `${settingsData?.socialLinks?.facebook}`; // Define your URL here
    window.open(url, "_blank");
  };
  const handleLinkClickWhats = () => {
    const url = `${settingsData?.socialLinks?.whatsapp}`; // Define your URL here
    window.open(url, "_blank");
  };
  const handleLinkClickYou = () => {
    const url = `${settingsData?.socialLinks?.youtube}`; // Define your URL here
    window.open(url, "_blank");
  };

  const handleLinkClickInsta = () => {
    const url = `${settingsData?.socialLinks?.instagram}`; // Define your URL here
    window.open(url, "_blank");
  };

  const handleCloseDrawer = () => {
    const drawerCheckbox = document.getElementById("my-drawer-4");
    if (drawerCheckbox) {
      drawerCheckbox.checked = false; // Close the drawer by unchecking the checkbox
    }
  };

  useEffect(() => {
    let total = 0;
    if (cartItems && cartItems.length > 0) {
      // Calculate the subtotal based on the cart items
      total = cartItems.reduce((accumulator, item) => {
        return accumulator + item.price * item.quantity;
      }, 0);
    }
    setSubTotal(total); // Update the subtotal state after calculation
  }, [cartItems]);

  const handleProfileRoute = () =>{

    setProfileMenu(true);
 }

 const handleCheckoutClick = () => {
  if (cartItems?.length > 0) {
    // go checkout page using router push 
    router.push("/checkout");
  } else {
    toast.error("You have no items in your cart, Please add to cart.");
  }
};


   

  return (
    <div>
      <div className="bg-black ">
        <div className="base-container pt-14 pb-20 ">
          {settingsData?.paymentBannerImg !== "" ? (
            <div>
              <div className="mb-4">
                <div>
                  <Image
                    src={`${imageBasePath}/${settingsData?.paymentBannerImg}`}
                    height={64}
                    width={1600}
                    priority
                    alt="payment-gateway-logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              </div>
            </div>
          ) : null}

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8  ">
            <div>
              <div className="mt-4 xls:mt-2 xms:mt-2 xs:mt-2 text-white">
                <div className="text-sm">
                  Call us:{" "}
                  <span className="font-semibold">{settingsData?.phone}</span>
                </div>
                <div className="text-sm">
                  Email us:{" "}
                  <span className="font-semibold underline">
                    {settingsData?.email}
                  </span>
                </div>
                <div className="text-sm">
                  Shop Address:{" "}
                  <span className="font-semibold underline">
                    {settingsData?.address?.house},{settingsData?.address?.road}
                    ,{settingsData?.address?.union},
                    {settingsData?.address?.district},
                    {settingsData?.address?.zipCode}
                  </span>
                </div>
              </div>
            </div>

            {/* <div>
            <p className="text-primary font-semibold">We accept</p>

            <div className="mt-4">
              <div>
                <Image width={360} src={PaymentGatewayImage} alt="payment-gateway-logo" />
              </div>
            </div>
          </div> */}
            <div>
              <ul className="mt-4 xls:mt-2 xms:mt-2 xs:mt-2 space-y-3">
                <li>
                  <Link
                    href="/users/login"
                    className="text-sm font-semibold text-white hover:text-secondary duration-300 cursor-pointer"
                  >
                    Sign in
                  </Link>
                </li>
                <li>
                  {" "}
                  <Link
                    href="/users/register"
                    className="text-sm font-semibold text-white hover:text-secondary duration-300 cursor-pointer"
                  >
                    Create New Account
                  </Link>
                </li>

                <li>
                  {token ? (
                    <Link
                      href="/users/profile"
                      className="text-sm font-semibold text-white hover:text-secondary duration-300 cursor-pointer"
                    >
                      My Orders
                    </Link>
                  ) : (
                    <Link
                      href="/users/login"
                      className="text-sm font-semibold text-white hover:text-secondary duration-300 cursor-pointer"
                    >
                      My Orders
                    </Link>
                  )}
                </li>

                {/* <li>
                  <Link
                    href="/affiliate-marketer/apply"
                    className="text-sm font-semibold text-white hover:text-secondary duration-300"
                  >
                    Sign Up for Reseller
                  </Link>
                </li> */}

                <li>
                  <Link
                    href="https://docs.google.com/forms/d/e/1FAIpQLSdNiBk7MvjTZ1hPhbaDYsKiQjvYsihtLfGYZpdtVMgeX6fBWA/viewform?usp=send_form"
                    target="_blank"
                    className="text-sm font-semibold text-white hover:text-secondary duration-300"
                  >
                    Complain Box
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <ul className="mt-4 space-y-3">
                <li>
                  <Link href="/refund-and-returned">
                    <p className="text-sm font-semibold text-white hover:text-secondary duration-300">
                      Refund & returned
                    </p>
                  </Link>
                </li>

                <li>
                  <Link href="/about-us">
                    <p className="text-sm font-semibold text-white hover:text-secondary duration-300">
                      About us
                    </p>
                  </Link>
                </li>

                <li>
                  <Link href="/privacy-policy">
                    <p className="text-sm font-semibold text-white hover:text-secondary duration-300">
                      Privacy policy
                    </p>
                  </Link>
                </li>

                <li>
                  <Link href="/terms-and-conditions">
                    {" "}
                    <p className="text-sm font-semibold text-white hover:text-secondary duration-300">
                      Terms & Condition
                    </p>
                  </Link>
                </li>
                <li>
                  <Link href="/showroom-list">
                    {" "}
                    <p className="text-sm font-semibold text-white hover:text-secondary duration-300">
                      Our showrooms
                    </p>
                  </Link>
                </li>
              </ul>
              <div className="flex space-x-2 items-center mt-5">
                {settingsData?.socialLinks?.facebook ? (
                  <div
                    onClick={() => handleLinkClickFb()}
                    className="bg-secondary h-7 w-7 rounded-full flex justify-center items-center cursor-pointer"
                  >
                    <FaFacebook className="text-white" />
                  </div>
                ) : null}
                {settingsData?.socialLinks?.youtube ? (
                  <div
                    onClick={() => handleLinkClickYou()}
                    className="bg-secondary h-7 w-7 rounded-full flex justify-center items-center cursor-pointer"
                  >
                    <FaYoutube className="text-white" />
                  </div>
                ) : null}
                {settingsData?.socialLinks?.whatsapp ? (
                  <div
                    onClick={() => handleLinkClickWhats()}
                    className="bg-secondary h-7 w-7 rounded-full flex justify-center items-center cursor-pointer"
                  >
                    <FaWhatsapp className="text-white" />
                  </div>
                ) : null}
                {settingsData?.socialLinks?.instagram ? (
                  <div
                    onClick={() => handleLinkClickInsta()}
                    className="bg-secondary h-7 w-7 rounded-full flex justify-center items-center cursor-pointer"
                  >
                    <FaInstagram className="text-white" />
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>

        <div className="xls:pb-16 xms:pb-16 xs:pb-16   text-center max-w-7xl mx-auto border-t-2 border-gray-700 py-4">
          <p className="text-white text-[12px]">
            Ahbab &copy; 2024 POWERED BY
            <span
              onClick={() => window.open("http://storex.com.bd/", "_blank")}
              className="text-primary font-semibold text-[14px] cursor-pointer"
            >
              {" "}
              STOREX
            </span>
          </p>
        </div>
      </div>

      {/* footer fixed bar  */}
      <div className="block md:hidden">
        <div className="fixed bottom-0 w-full z-10">
          <div className="border w-full bg-white shadow px-2">
            <div className="grid grid-cols-5 items-center ">
            

              <div
                onClick={() => {
                  setSideCategory(true);
                }}
                className="flex justify-center"
              >
                <p className="">
                  <i className="ri-apps-2-line text-black text-xl"></i>
                </p>
              </div>

              <div    className="flex justify-center cursor-pointer">
                <p className="" onClick={handleCheckoutClick} >
                  <IoBagCheckOutline className="text-black text-xl" />
                </p>
              </div>

              <Link href="/" className="flex justify-center ">
                <p className=" ">
                  <i className="ri-home-2-line text-[#DA1C5C] text-[2rem] "></i>
                </p>
              </Link>

            

              <Link href="/" className="flex justify-center">
                <p className="">
                  <FaPhone className="ri-shopping-cart-2-line text-black text-xl" />
                </p>
              </Link>

              <div className="flex justify-center" onClick={() => handleProfileRoute()}>
                <p className="">
                  {/* <CgProfile className="text-[#6B7280]  text-xl" /> */}
                  <Image
                        src="/image/profile.png"
                        alt="search"
                        width={20}
                        height={20}
                        sizes={100}
                        className="cursor-pointer"
                      />
                </p>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>

      {/* side cart  */}

      {pathname !== "/checkout" && cartItems?.length > 0 && (
        <div className="container max-w-[1600px] mx-auto relative">
          <div className="drawer-content">
            <label htmlFor="my-drawer-4">
              <div className="fixed top-1/2 right-0 transform -translate-y-20 !z-30 w-16 md:w-20 shadow-lg group cursor-pointer ">
                <div className="bg-secondary group-hover:bg-[#55584D]">
                  <div className="flex flex-col items-center justify-center py-1">
                    <i className="text-lg md:text-2xl ri-shopping-cart-2-line text-white"></i>
                    {/* <Image
                        src="/image/cart.png"
                        alt="search"
                        width={20}
                        height={20}
                        sizes={100}
                        className="cursor-pointer"
                      /> */}
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
          <div className="bg-white min-h-full w-80 p-4 flex flex-col justify-between">
            {/* Cart Items Section */}
            <div className="flex-1 ">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Cart</h3>
                <button onClick={handleCloseDrawer}>
                  <i className="ri-close-line text-2xl text-red-600"></i>
                </button>
              </div>

              {/* SideCart Component (cart items) */}
              <div className="">
                <SideCart cartItems={cartItems} />
              </div>
            </div>

            {/* Subtotal and Checkout Section */}
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
                <button className="w-full bg-secondary text-white py-2 rounded-lg">
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
