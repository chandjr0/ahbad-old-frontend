import Link from "next/link";
import { IoHomeSharp } from "react-icons/io5";
import BigscreenSearchCompo from "./Layout/Header/BigscreenSearchCompo";
import CartCompo from "./Layout/Header/CartCompo";
import BigscreenUserCompo from "./Layout/Header/BigscreenUserCompo";
import NavList from "./Layout/Header/NavList";
import NavHamburg from "./Layout/Header/NavHamburg";
import BigscreenLogo from "./Layout/Header/BigscreenLogo";
import SmallscreenLogo from "./Layout/Header/SmallscreenLogo";
import SmallCartCompo from "./Layout/Header/SmallCartCompo";
import Image from "next/image";

export default function Header() {
  return (
    <div className={`bg-white text-black  sticky top-0 left-0 right-0 z-40`}>
      <header className="bg-white ">
        <div className="hidden md:block lg:block xl:block md:px-20">
          <div>
            <div className="flex justify-between py-3 items-center">
              <div className="flex gap-6">
                <div className="w-[237px] h-[67.71px] ">
                  <BigscreenLogo />
                </div>
                <NavList />
              </div>

              <div className="flex items-center justify-center gap-4">
                <BigscreenSearchCompo />
                <BigscreenUserCompo />
                {/* <Image
      src="/image/wishlist.png"
      alt="search"
      width={20}
      height={20}
      sizes={100}
      className="cursor-pointer"
    /> */}
                {/* <CartCompo /> */}
              </div>
            </div>
          </div>

          {/* <div className="border-t flex space-x-2 border-gray-900">
            <NavList />
          </div> */}
        </div>

        <div className="block md:hidden lg:hidden xl:hidden 2xl:hidden custom-box-shadow relative">
          <div className="flex justify-between items-center px-4 py-3 gap-3 ">
            <div className="flex items-center gap-6">
              <NavHamburg />
              <SmallscreenLogo />
            </div>
            <SmallCartCompo />
          </div>
        </div>
      </header>
    </div>
  );
}