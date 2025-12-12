import request from "@/lib/request";
import Link from "next/link";
import React from "react";
import { SlArrowDown } from "react-icons/sl";

async function getHomeSettings() {
  try {
    let res = await request(`setting/admin/site-view`);
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("err in get settings", error);
  }
}

export const revalidate = 0;

const NavList = async () => {
  const homeSettings = await getHomeSettings();

  return (
    <ul className="flex items-center">
      {Array.isArray(homeSettings?.data?.data?.categoryData) && homeSettings.data.data.categoryData.length > 0 ? homeSettings.data.data.categoryData.map((item, index) => (
        <li key={index} className="relative">
          <Link
            className="group relative flex space-x-2 items-center px-4 py-2 cursor-pointer"
            href={`/category/${item?.slug}`}
          >
            <div className="flex mt-2 items-center space-x-2 group-hover:border-b group-hover:border-gray-400">
              <p className="uppercase text-sm">{item?.name}</p>
              {item?.children?.length > 0 && (
                <div>
                  <SlArrowDown size={12} />
                </div>
              )}
            </div>

            {item?.children?.length > 0 && (
              <div className="absolute z-10 w-[250px] top-10 left-0 hidden group-hover:block">
                <div className="bg-white shadow-lg rounded-lg py-2 mt-2 transform transition-transform duration-300 ease-in-out hover:translate-y-1">
                  <div className="px-2 flex">
                    <ul className="w-full space-y-2">
                      {item?.children?.map((subCat, subIndex) => (
                        <li
                          key={subIndex}
                          className={` bg-gray-100 rounded-md shadow-md transition-all duration-300 transform hover:bg-primary hover:shadow-lg hover:-translate-y-1`}
                        >
                          <Link href={`/category/${subCat?.slug}`}>
                            <p className="px-4 py-2 text-black capitalize text-base font-medium transition-colors duration-300 hover:text-white">
                              {subCat?.name}
                            </p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </Link>
        </li>
      )) : null}
    </ul>
  );
};

export default NavList;
