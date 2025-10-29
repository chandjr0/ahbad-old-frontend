"use client"

import React, { useState } from 'react'
import { AiOutlineSearch } from "react-icons/ai";
import TrackingModal from '../TrackingModal';
import request from '@/lib/request';

const TrackOrderCompo = () => {
 
    const [trackingModal,setTrackingModal] = useState(false);

    const [phoneNo, setPhoneNo] = useState('');

   const [orderList,setOrderList] = useState([])



    const handleChange = (value) =>{
        setPhoneNo(value);

    }

      const handleClick = async () => {
        if (phoneNo) {
          const getData = async () => {
            let res = await request(
              `admin-order/customer/visitor-orders/${phoneNo}?page=1&limit=10`
            );
        
            setOrderList(res?.data?.data)
            setTrackingModal(true);
          };
          getData();
        }
      };

       const handleClose = () => {
         setTrackingModal(false);
        setOrderList([]);
         setPhoneNo("");
       };

      //  console.log("orderList...", orderList);

    

  return (
    <div className="w-[50%] md:w-[40%] sm:w-[50%] xls:w-full xms:w-full xs:w-full pt-2  z-10">
      <div className=" bg-white border shadow-lg rounded-md  py-[10px] px-[20px]">
        <div className="flex">
          <input
            className="border-[1px] border-secondary   pl-2 w-[70%] outline-none placeholder:text-xs"
            placeholder="Enter Your Tracking Code"
            value={phoneNo}
            onChange={(e) => handleChange(e.target.value)}
          />
          <button
            className="bg-secondary text-white  py-2 ml-2 w-[30%] px-5 rounded "
            onClick={() => handleClick()}
          >
            <AiOutlineSearch size={20} className="text-center inline" />
          </button>
        </div>
      </div>
      <TrackingModal
        trackingModal={trackingModal}
        setTrackingModal={setTrackingModal}
        orderList={orderList}
        handleClose={handleClose}
      />
    </div>
  );
}

export default TrackOrderCompo