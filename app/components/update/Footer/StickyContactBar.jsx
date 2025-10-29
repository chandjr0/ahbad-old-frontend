"use client";

import React, { useState, useEffect } from "react";
import { FaPhone, FaWhatsapp } from "react-icons/fa";
import { RiMessengerLine } from "react-icons/ri";
import { BsChatDotsFill } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import Link from "next/link";

const StickyContactBar = ({ settingsData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);

  const toggleContactBar = () => {
    setIsOpen(!isOpen);
    setHasClicked(true);
  };

  // Phone number and social links from settings
  const phoneNumber = settingsData?.phone || "";
  const whatsappNumber = settingsData?.socialLinks?.whatsapp || "";
  const messengerUsername = settingsData?.socialLinks?.facebook || "";

  // Generate WhatsApp link with proper formatting
  const whatsappLink = whatsappNumber 
    ? `https://api.whatsapp.com/send/?phone=${whatsappNumber}`
    : "#";

  // Generate Messenger link
  const messengerLink = messengerUsername 
    ? `https://m.me/${messengerUsername}`
    : "#";

  return (
    <div className="fixed bottom-[8.5rem] right-4 z-50">
      {/* Contact Options */}
      <div className="flex flex-col items-end gap-2">
        {/* Phone Button - Appears when open */}
        <div 
          className={`flex items-center bg-green-500 text-white rounded-full shadow-lg cursor-pointer transform transition-all duration-300 ease-in-out ${
            isOpen 
              ? "opacity-100 translate-y-0 scale-100" 
              : "opacity-0 translate-y-10 scale-0 pointer-events-none"
          }`}
        >
          <Link href={`tel:${phoneNumber}`} className="flex items-center p-3 md:p-4">
            <FaPhone  />
            {/* <span className="text-sm font-medium">Call Now</span> */}
          </Link>
        </div>

        {/* WhatsApp Button - Appears when open */}
        <div 
          className={`flex items-center bg-[#25D366] text-white rounded-full shadow-lg cursor-pointer transform transition-all duration-300 ease-in-out ${
            isOpen 
              ? "opacity-100 translate-y-0 scale-100 delay-100" 
              : "opacity-0 translate-y-10 scale-0 pointer-events-none"
          }`}
        >
          <a 
            href={whatsappLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center p-3 md:p-4"
          >
            <FaWhatsapp  />
            {/* <span className="text-sm font-medium">WhatsApp</span> */}
          </a>
        </div>

        {/* Messenger Button - Appears when open */}
        <div 
          className={`flex items-center bg-[#1E88E5] text-white rounded-full shadow-lg cursor-pointer transform transition-all duration-300 ease-in-out ${
            isOpen 
              ? "opacity-100 translate-y-0 scale-100 delay-200" 
              : "opacity-0 translate-y-10 scale-0 pointer-events-none"
          }`}
        >
          <a 
            href={messengerLink} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex items-center p-3 md:p-4"
          >
            <RiMessengerLine/>
            {/* <span className="text-sm font-medium">Messenger</span> */}
          </a>
        </div>

        {/* Main Toggle Button */}
        <div 
          onClick={toggleContactBar}
          className="relative w-12 h-12 rounded-full flex items-center justify-center shadow-lg cursor-pointer z-20 transition-all duration-300"
          style={{ backgroundColor: "#fdbe2e" }}
        >
          {isOpen ? (
            <IoClose className="text-black text-2xl md:text-3xl transition-all duration-300 transform rotate-0" />
          ) : (
            <BsChatDotsFill className="text-black text-2xl md:text-3xl transition-all duration-300" />
          )}
        </div>
      </div>
    </div>
  );
};

export default StickyContactBar; 