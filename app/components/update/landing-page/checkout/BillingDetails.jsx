import React from "react";
import ReactSelect from "react-select";

const BillingDetails = () => {
  const options = [
    { value: "chocolate", label: "Chocolate" },
    { value: "strawberry", label: "Strawberry" },
    { value: "vanilla", label: "Vanilla" },
  ];

  return (
    <div>
      <p className="text-gray-600 border-dashed border-b-2 border-[#c3c1c1] inline-block text-xl font-semibold ">
        Billing Details
      </p>

      <div>
        <div className="mt-6">
          <label className="block text-black text-sm mb-2" htmlFor="name">
            Enter Your Name <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            className="appearance-none border border-[#D9D9D9] rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Enter full name"
          />
        </div>

        <div className="mt-4">
          <label className="block text-black text-sm mb-2" htmlFor="phone">
            Enter Your Phone Number{" "}
            <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            className="appearance-none border border-[#D9D9D9] rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="phone"
            type="number"
            placeholder="Enter 11-digit phone number"
          />
        </div>

        <div className="mt-4">
          <label className="block text-black text-sm mb-2">
            Select District <span className="text-red-500 font-bold">*</span>
          </label>
          <ReactSelect
            className=""
            options={options}
            placeholder="Select District"
          />
        </div>

        <div className="mt-4">
          <label className="block text-black text-sm mb-2">
            Select Police Station <span className="text-red-500 font-bold">*</span>
          </label>
          <ReactSelect
            className=""
            options={options}
            placeholder="Select Police Station"
          />
        </div>

        <div className="mt-4">
          <label className="block text-black text-sm mb-2">
            Full Address <span className="text-red-500 font-bold">*</span>
          </label>
          <input
            className="appearance-none border border-[#D9D9D9] rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="House number, Road, Union, Upazila, District"
          />
        </div>

        <div className="mt-10">
          <p className="text-sm text-gray-500">
            Country / Region <span className="text-red-500 font-bold">*</span>{" "}
          </p>

          <h2 className="text-lg font-semibold">Bangladesh</h2>
        </div>
      </div>
    </div>
  );
};

export default BillingDetails;
