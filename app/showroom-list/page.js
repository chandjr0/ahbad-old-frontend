import request from "@/lib/request";
import React from "react";


async function getShowroom() {
  try {
    let res = await request(`setting/showroom/view-all`);
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("err in getShowroom", error);
  }
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

const ShowroomLIst =async () => {

  const showroomlist = await getShowroom();


   
  return (
    <div className="bg-white text-black">
      <div className="max-w-7xl mx-auto px-5 min-h-[550px]">
        <div className="grid grid-cols-3 sm:grid-cols-2 xls:grid-cols-1 xms:grid-cols-1 xs:grid-cols-1 gap-6 py-10">
          {showroomlist?.data?.data?.map((item,index)=>(
             <div className="shadow-md p-3" key={index}>
            <div className="font-bold text-xl text-center">
             {item?.name}
            </div>
            <div className="text-center">
              {item?.address}
            </div>
            <div className="text-center">{item?.phones}</div>
          </div>

          ))}
         
        </div>
      </div>
    </div>
  );
};

export default ShowroomLIst;
