"use client";
import React, { useState, useEffect } from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaUser } from "react-icons/fa6";

const AddressSection = ({
  note,
  address,
  phone,
  district,
  thana,
  name,
  setName,
  setPhone,
  setDistrict,
  setThana,
  setNote,
  setAddress,
  districtList,
  isError,
  getDistrictWiseThana,
  thanaList,
  // getThanaWiseArea,
  // areaList,
  // selectedArea,
  // setSelectedArea
}) => {

  const [isValid, setIsValid] = useState(true);

 

  return (
    <div className=" mt-0 px-4 pb-2 rounded-md pt-1 sm:mt-2 xls:mt-2 xms:mt-2 xs:mt-2">
      <div className="relative">
        <p className="text-left font-semibold text-lg text-black">
          বিলিং ডিটেইল
        </p>
        <div className="absolute top-2 left-0 w-[25%] h-full bg-transparent border-b-4 border-dashed border-gray-300 pointer-events-none"></div>
      </div>

      <div className="pt-4">
        <label className="text-sm font-bold">
          আপনার নাম লিখুন <span className="text-red-600">*</span>
        </label>
        <div className="w-full pt-2">
          <input
            className="bg-white w-full pl-2 h-[40px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
            placeholder="সম্পূর্ণ নামটি লিখুন"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </div>
        {name == "" && isError ? (
          <div className="mt-2 md:left-0 left-0 text-red-600 text-xs pl-1">
            এটি পূরণ আবশ্যক
          </div>
        ) : null}
      </div>

      <div className="pt-2">
        <label className="text-sm font-bold">
          আপনার মোবাইল নাম্বারটি লিখুন <span className="text-red-600">*</span>
        </label>
        <div className="w-full pt-2">
          <input
            className="bg-white w-full pl-2 h-[40px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
            placeholder="১১ ডিজিটের মোবাইল নাম্বারটি লিখুন"
            onChange={(e) => {
              let inputValue = e.target.value.replace(/\D/g, ''); // Remove non-numeric characters
              if (inputValue.length > 11) {
                inputValue = inputValue.slice(0, 11);
              }
              setPhone(inputValue);
            }}
            
            value={phone}
            type="text"
            name="phone"
          />
        </div>
        {phone == "" && isError ? (
          <div className="mt-2 md:left-0 left-0 text-red-600 text-xs pl-1">
            এটি পূরণ আবশ্যক
          </div>
        ) : null}
        {isValid ? null : (
          <div className="mt-2 md:left-0 left-0 text-red-600 text-xs pl-1">
            এটি পূরণ আবশ্যক
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 xls:grid-cols-1 xms:grid-cols-1 xs:grid-cols-1 gap-4 pt-2">
        <div>
          <label className="text-sm font-bold">
            জেলা সিলেক্ট করুন <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                setDistrict(e.target.value);
                getDistrictWiseThana(e.target.value);
              }}
              value={district}
              className="bg-gray-50 h-[40px] mt-2 border border-gray-300 text-black text-sm rounded-lg  block w-full p-2.5 appearance-none focus:border-secondary outline-none"
            >
              <option value={"select"}>Select</option>
              {districtList?.map((item, index) => (
                <option key={index} value={item?.city_id}>
                  {item?.city_name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
              </svg>
            </div>
          </div>
          {district == "select" && isError ? (
            <div className="mt-2 md:left-0 left-0 text-red-600 text-xs pl-1">
              এটি পূরণ আবশ্যক
            </div>
          ) : null}
        </div>
        <div>
          <label className="text-sm font-bold">
            থানা সিলেক্ট করুন <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <select
              onChange={(e) => {
                setThana(e.target.value);
                // getThanaWiseArea(e.target.value);
              }}
              value={thana}
              className="bg-gray-50 mt-2 h-[40px] border border-gray-300 text-black text-sm rounded-lg  block w-full p-2.5 appearance-none focus:border-secondary outline-none"
            >
              <option value={"select"}>Select</option>
              {thanaList?.map((item, index) => (
                <option key={index} value={item?.zone_id}>
                  {item?.zone_name}
                </option>
              ))}
            </select>
            {thana == "select" && isError ? (
              <div className="mt-2 md:left-0 left-0 text-red-600 text-xs pl-1">
                এটি পূরণ আবশ্যক
              </div>
            ) : null}
            <div className="absolute top-[12px] right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
              </svg>
            </div>
          </div>
        </div>
        {/* <div>
          <label className="text-sm font-bold">
            নিকটবর্তী এলাকা সিলেক্ট করুন <span className="text-red-600">*</span>
          </label>
          <div className="relative">
            <select
              onChange={(e) => setSelectedArea(e.target.value)}
              value={selectedArea}
              className="bg-gray-50 mt-2 h-[40px] border border-gray-300 text-black text-sm rounded-lg  block w-full p-2.5 appearance-none focus:border-secondary outline-none"
            >
              <option value={"select"}>Select</option>
              {areaList?.map((item, index) => (
                <option key={index} value={item?.area_id}>
                  {item?.area_name}
                </option>
              ))}
            </select>
            {thana == "select" && isError ? (
              <div className="mt-2 md:left-0 left-0 text-red-600 text-xs pl-1">
                এটি পূরণ আবশ্যক
              </div>
            ) : null}
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
              </svg>
            </div>
          </div>
        </div> */}
      </div>

      <div className="pt-2">
        <label className="text-sm font-bold">
          সম্পূর্ণ ঠিকানা <span className="text-red-600">*</span>
        </label>
        <div className="w-full pt-2">
          <input
            className="bg-white w-full pl-2 h-[40px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
            placeholder="রোড নাম/নাম্বার, বাড়ি নাম/নামার, ফ্লাট নাম্বার"
            onChange={(e) => setAddress(e.target.value)}
            value={address}
          />
        </div>
        {address == "" && isError ? (
          <div className="mt-2 md:left-0 left-0 text-red-600 text-xs pl-1">
            এটি পূরণ আবশ্যক
          </div>
        ) : null}
      </div>

      <div className="pt-2">
        <label className="text-sm font-bold">নির্দেশনা</label>
        <div className="w-full pt-2">
          <textarea
            className="bg-white w-full pl-2 pt-2  rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
            placeholder="আপনার স্পেশাল কোন রিকোয়ারমেন্ট থাকলে এখানে লিখুন"
            onChange={(e) => setNote(e.target.value)}
            value={note}
          />
        </div>
      </div>
    </div>
  );
};

export default AddressSection;
