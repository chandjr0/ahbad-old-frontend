/* eslint-disable @next/next/no-html-link-for-pages */
"use client"

import Link from "next/link";
import styles from "./BottomNavbar.module.css";
import { useStatus } from "@/context/contextStatus";
import {  AiFillHome } from "react-icons/ai";

import { FaUser } from "react-icons/fa";
import { useRouter } from "next/navigation";


export default function BottomNavbar() {

  const { setProfileMenu } = useStatus();


const router = useRouter()
   


const handleProfileRoute = () =>{

   setProfileMenu(true);
}
  
 

 
  return (
    <div
      className={`bg-white xxl:hidden xl:hidden lg:hidden md:hidden fixed bottom-0 w-full z-10 border border-[#d1d5db] p-[8px] shadow-lg filter drop-shadow-lg`}
    >
      <div className={styles.icons}>
        

        <Link href="/">
          <span>
            <AiFillHome size={20} className="fill-current text-gray-500" />
          </span>
          <span className="text-[10px] text-gray-500 capitalize ">Home</span>
        </Link>

        
        <div onClick={() => handleProfileRoute()}>
          <span>
            <FaUser size={16} className="fill-current text-gray-500" />
          </span>
          <span className="text-[10px] text-gray-500 capitalize">profile</span>
        </div>

        {/* </Link> */}

        {/* <span
          onClick={() => {
            setSideCategory(true);
          }}
        >
          <Image
            priority={true}
            height={25}
            width={25}
            src="/assets/images/icons/menu-line.png"
            alt="category"
          />
        </span> */}
      </div>
    </div>
  );
}
