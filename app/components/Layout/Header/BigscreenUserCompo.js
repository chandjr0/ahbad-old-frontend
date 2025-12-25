"use client";

import React, { Fragment, useEffect, useState } from "react";

import { Menu, Transition } from "@headlessui/react";
import { FaRegUser, FaUserCircle } from "react-icons/fa";
import { FiUser } from "react-icons/fi";
import { useStatus } from "@/context/contextStatus";
import { destroyCookie, parseCookies } from "nookies";

import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Image from "next/image";

const BigscreenUserCompo = () => {
  const { token, setToken } = useStatus();
  const router = useRouter();

  const [phone, setPhone] = useState(null);
  const [name, setName] = useState(null);

  const cookie = parseCookies();

  const handleLogout = () => {
    toast.success("Successfully logged out!");
    destroyCookie(null, "token", {
      path: "/",
    });
    destroyCookie(null, "userInfo", {
      path: "/",
    });
    localStorage.removeItem("visited");
    setToken(null);
    router.push("/");
  };

  useEffect(() => {
    try {
      if (cookie?.hasOwnProperty("userInfo")) {
        const parsedPhone = JSON.parse(cookie.userInfo);

        setPhone(parsedPhone?.phone);
        setName(parsedPhone?.name);
      }
    } catch (error) {
      console.error("Error parsing JSON:", error);
    }
  }, [cookie]);

  return (
    <>
      <Menu as="div" className="relative ">
        {({ open }) => (
          <Fragment>
            <div>
              {token ? (
                <Menu.Button className="max-w-xs bg-white flex items-center space-x-2 text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:myblue-500">
                  <div className="sr-only">Open user menu</div>

                  <div className="h-9 w-9 rounded-full border border-gray-300 flex justify-center items-center">
                    <svg
                      className="fill-current text-black h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                    >
                      <path fill="none" d="M0 0h24v24H0z" />
                      <path d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
                    </svg>
                  </div>
                  <p>{name}</p>
                </Menu.Button>
              ) : (
                <Menu.Button> 
                    <div>
                      <FiUser className="text-black " size={22} />
                      {/* <Image
                        src="/image/nav-profile-logo.png"
                        alt="search"
                        width={18}
                        height={18}
                        sizes={100}
                        className=" cursor-pointer !object-scale-down mt-1"
                      /> */}
                    </div>
                </Menu.Button>
              )}
            </div>

            {token ? (
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute z-40  right-4 w-[15rem]  rounded-md shadow-lg mt-4 px-4 py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <div>
                        <div
                          onClick={() => router.push("/users/profile")}
                          className="cursor-pointer"
                        >
                          <div className="bg-green-500 text-white text-center capitalize font-bold py-2 text-sm">
                            My profile
                          </div>
                        </div>
                      </div>
                    )}
                  </Menu.Item>

                  <Menu.Item>
                    {({ active }) => (
                      <div className="mt-3">
                        <div
                          onClick={() => handleLogout()}
                          className="cursor-pointer"
                        >
                          <div className="bg-gray-900 text-white capitalize text-center font-bold py-2 text-sm">
                            logout
                          </div>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            ) : (
              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="origin-top-right absolute z-40  right-11 w-[19rem]  rounded-md shadow-lg mt-4 px-4 py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <div>
                        <div
                          onClick={() => router.push("/users/login")}
                          className="cursor-pointer"
                        >
                          <div className="bg-green-500 text-white text-center font-bold py-2 text-sm">
                            Login/SignUp
                          </div>
                        </div>
                      </div>
                    )}
                  </Menu.Item>

                  {/* <Menu.Item>
                    {({ active }) => (
                      <div className="mt-3">
                        <div
                          onClick={() =>
                            router.push("/affiliate-marketer/apply")
                          }
                          className="cursor-pointer"
                        >
                          <div className="bg-gray-900 text-white text-center font-bold py-2 text-sm">
                            Sign Up for Reseller
                          </div>
                        </div>
                      </div>
                    )}
                  </Menu.Item> */}
                </Menu.Items>
              </Transition>
            )}
          </Fragment>
        )}
      </Menu>
    </>
  );
};

export default BigscreenUserCompo;
