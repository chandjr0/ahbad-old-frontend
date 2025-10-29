"use client";

import PageView from "@/app/api/conversion/PageView";
import Purchase from "@/app/api/conversion/Purchase";
import { imageBasePath } from "@/config";
import { useStatus } from "@/context/contextStatus";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BsCheck2 } from "react-icons/bs";

const PaymentSuccessful = (params) => {
  const [eventData, setEventData] = useState(null);
  const { settingsData, siteView } = useStatus();
  const [shipping, setShipping] = useState();
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    address: ''
  });

  useEffect(() => {
    // Retrieve eventData and customerInfo from localStorage
    const storedEventData = localStorage.getItem("eventData");
    const storedCustomerInfo = localStorage.getItem("customerInfo");
    
    console.log("Thank you page initialized");
    console.log("Stored customer info:", storedCustomerInfo);

    if (storedEventData) {
      try {
        // Parse the string into an object
        const parsedEventData = JSON.parse(storedEventData);
        setEventData(parsedEventData);
        setShipping(parsedEventData?.shipping);
      } catch (error) {
        console.error("Error parsing stored event data:", error);
      }
    }

    if (storedCustomerInfo) {
      try {
        const parsedCustomerInfo = JSON.parse(storedCustomerInfo);
        console.log("Parsed customer info:", parsedCustomerInfo);
        
        setCustomer(prevState => ({
          ...prevState,
          ...parsedCustomerInfo
        }));
        
        // Don't clear customer info immediately to allow for order tracking
        // Will be cleared when user starts a new order or navigates away
      } catch (error) {
        console.error("Error parsing stored customer info:", error);
      }
    } else {
      console.warn("No customer info found in localStorage");
      // If no stored customer info, use the name from params
      if (params?.params?.Id && params?.params?.Id[2]) {
        console.log("Using name from URL params:", decodeURIComponent(params?.params?.Id[2]));
        setCustomer(prevState => ({
          ...prevState,
          name: decodeURIComponent(params?.params?.Id[2])
        }));
      }
    }
  }, [params]);

  // Payment method could be from eventData or hardcoded based on your system
  const paymentMethod = eventData?.paymentMethod || "CashOnDelivery";

  // Order ID from params
  const orderId = params?.params?.Id && params?.params?.Id[0];

  // Total amount from params
  const totalAmount = params?.params?.Id && params?.params?.Id[1];

  return (
    <div>
      <PageView />
      <Purchase data={eventData} shipping={shipping} />

      <div className="min-h-screen bg-gray-100 py-10 px-4">
        <div className="max-w-md mx-auto bg-white rounded-lg overflow-hidden shadow-sm">
          {/* Logo Header */}
          <div className="p-6 bg-white border-b border-gray-200">
            <div className="flex justify-center">
              <Link href="/">
                <Image
                  src={`${imageBasePath}/${siteView?.logoImg}`}
                  width={159}
                  height={51}
                  alt="logo image"
                  className="w-[124px] md:w-[159px] h-[40px] md:h-[51px]"
                />
              </Link>
            </div>
          </div>

          {/* Success Icon */}
          <div className="flex justify-center -mt-6">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <BsCheck2 className="text-white text-4xl" />
            </div>
          </div>

          {/* Success Message */}
          <div className="text-center px-6 py-4">
            <h2 className="text-2xl font-bold text-gray-800">Your order is successfully placed</h2>
            <p className="text-gray-600 mt-2">Thank you for purchasing our products!</p>
          </div>

          {/* Order Details */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-600">Order ID:</span>
              <span className="text-teal-500 font-semibold">#{orderId}</span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer information</h3>

            {(!customer.name && !customer.phone && !customer.address) ? (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md mb-4">
                <p className="text-yellow-700 text-sm">
                  Customer information could not be retrieved. Please check your order confirmation email for complete details.
                </p>
              </div>
            ) : (
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Full name:</span>
                  <span className="text-gray-800">{customer.name || 'N/A'}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="text-gray-800">{customer.phone || 'N/A'}</span>
                </div>

                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="text-gray-800">{customer.email || 'N/A'}</span>
                </div> */}

                <div className="flex justify-between">
                  <span className="text-gray-600">Address:</span>
                  <span className="text-gray-800 text-right max-w-[60%]">
                    {customer.address || 'N/A'}
                    {customer.district && `, ${customer.district}`}
                    {customer.policeStation && `, ${customer.policeStation}`}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment method:</span>
                  <span className="text-gray-800">Cash On Delivery</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Payment status:</span>
                  <span className="bg-yellow-400 text-xs font-medium px-2 py-1 rounded text-yellow-800">PENDING</span>
                </div>
              </div>
            )}
          </div>

          {/* Go To Homepage Button */}
          <div className="px-6 py-4 border-t border-gray-200">
            <Link href="/">
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-md transition duration-300 font-medium uppercase">
                GO TO HOMEPAGE
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessful;
