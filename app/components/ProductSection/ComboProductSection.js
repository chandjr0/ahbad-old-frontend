"use client";

import request from "@/lib/request";
import { useEffect, useState } from "react";
import Custom404 from "../Custom404";
import ProductCard from "../ProductCard";

const ComboProductSection = ({ item, totalData }) => {
  const [page, setPage] = useState(1);
  console.log("item", item);

  const [data, setData] = useState([]);

  useEffect(() => {
    if (item) {
      setData(item);
    }
  }, [item]);

  const arrUpdate = async () => {
    setPage(page + 1);
    let arr3 = data;
    const res = await request(
      `combo/admin-customer/list?page=${page}&limit=24`
    );

    if (res?.success) {
      let datanew = arr3.concat(res?.data?.data);
      setData(datanew);
    }
  };


//   console.log("data", data);
  

  return (
    <div>
      {data?.length > 0 ? (
        <>
          <div className="grid grid-cols-5 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-3 xls:grid-cols-2 xms:grid-cols-2 xs:grid-cols-2 gap-6 md:gap-4 sm:gap-3 xls:gap-2 xms:gap-2 xs:gap-2 pt-8 pb-7">
            {data?.length &&
              data?.map((catitem, index) => (
                <div key={index}>
                  <ProductCard productDetails={catitem} combo={true} />
                </div>
              ))}
          </div>
          <div className="flex justify-center mt-3 pb-3">
            {totalData == data?.length ? null : (
              <button
                onClick={arrUpdate}
                className="bg-black text-white px-3 py-2 text-[13px] rounded-md"
              >
                See More
              </button>
            )}
          </div>
        </>
      ) : (
        <Custom404 />
      )}
    </div>
  );
};

export default ComboProductSection;
