"use client"

import { useRouter } from "next/navigation";
import { RxDoubleArrowRight } from "react-icons/rx";

const BreadCrumbs = ({ breadCumbs }) => {
  const router = useRouter();

  const handleRoute = (url, index) => {
      
   
     if (index == 0) {
      router.replace(`/`);
    }
  };

  return (
    <div className="base-container hidden lg:block">
      <ol className="inline-flex flex-wrap text-gray-700 space-x-1 items-center pl-2">
        {breadCumbs?.map((breadCumb, index) => (
          <li className="inline-flex items-center" key={index}>
            <div onClick={() => handleRoute(breadCumb?.url, index)}>
              {breadCumb?.name?.length > 32 ? (
                <p
                  className={`text-base ${
                    index == 0
                      ? "hover:text-primary hover:underline cursor-pointer xls:text-sm xms:text-sm xs:text-xs"
                      : ""
                  }`}
                >
                  {breadCumb?.name}
                </p>
              ) : (
                <p
                  className={`text-base ${
                    index == 0
                      ? "hover:text-primary hover:underline cursor-pointer xls:text-sm xms:text-sm xs:text-xs"
                      : ""
                  }`}
                >
                  {breadCumb?.name}
                </p>
              )}
            </div>
            {breadCumbs?.length - 1 !== index && (
              <RxDoubleArrowRight
                size={15}
                className="text-gray-400 font-bold"
              />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default BreadCrumbs;
