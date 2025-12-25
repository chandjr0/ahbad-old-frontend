"use client";

import React, { useState, useEffect } from "react";
import Cash from "@/public/image/checkout/cash.png";
import Image from "next/image";
import CouponSection from "./CouponSection";
import { FaLock } from "react-icons/fa6";
import { useStatus } from "@/context/contextStatus";
import { imageBasePath } from "@/config";
import { Triangle } from "react-loader-spinner";
import { AiFillDelete } from "react-icons/ai";
import { toast } from "react-toastify";
import Amarpay from "@/public/image/checkout/aamarpay_logo.png";
import encryptData from "@/app/api/encrypt";
import postRequest from "@/lib/postRequest";
import Gtm from "@/app/Gtm";

const CartoverviewSection = ({
  paymentOption,
  setPaymentOption,
  deliveryOption,
  setDeliveryOption,
  deliveryData,
  setSubTotal,
  subTotal,
  createOrder,
  applyPromo,
  promoDiscount,
  isPromo,
  loading,
  removePromo,
  settingsData,
  isDeliveryPromo,
  setPayPhone,
  setTransaction,
  setPaymentInfo,
  payPhone,
  transaction,
  paymentInfo,
}) => {
  const { cartItems, setCartItems, token, setToken } = useStatus();
  const [renderMe, setRenderMe] = useState(false);
  const { promoCode, setPromoCode } = useStatus();
  const [gtmCheckout, setGtmCheckout] = useState({});

  useEffect(() => {
    let total = 0;
    // Only set delivery option if deliveryData exists and we don't already have one set
    if (deliveryData?.outside?.amount !== undefined) {
      setDeliveryOption({
        type: "outside",
        amount: Number(deliveryData?.outside?.amount) || 0,
      });
    }

    const calculation = async () => {
      cartItems?.map((item, index) => {
        const price = Number(item?.price) || 0;
        const quantity = Number(item?.quantity) || 0;
        total = total + price * quantity;
      });
    };
    calculation();
    setSubTotal(isNaN(total) ? 0 : total);
  }, [cartItems, renderMe, deliveryData, setDeliveryOption, setSubTotal]);

  const increment = async (index, stock, qty, item) => {
    if (item?.isCombo) {
      const updatedCartItems = [...cartItems]; // Create a new array
      updatedCartItems[index].quantity += 1;
      setCartItems(updatedCartItems);
      encryptData(updatedCartItems);
      setRenderMe(!renderMe);
    } else {
      const obj = {
        variationId: cartItems[index]?.variationId || "",
        productId: cartItems[index]?.productId,
      };

      try {
        let res = await postRequest(
          `product/admin-customer/check-product-stock`,
          obj
        );
        if (res && res?.data) {
          // Ensure stock and qty are numbers for comparison
          const availableStock = typeof res?.data?.stock === 'string' 
            ? parseFloat(res.data.stock) || 0 
            : res?.data?.stock || 0;
          const currentQty = typeof qty === 'string' 
            ? parseFloat(qty) || 0 
            : qty || 0;
          
          if (availableStock > currentQty) {
            const updatedCartItems = [...cartItems]; // Create a new array
            updatedCartItems[index].quantity += 1;
            setCartItems(updatedCartItems);
            encryptData(updatedCartItems);
            setRenderMe(!renderMe);
          } else {
            toast.warning("Warning! No More Stock Left");
          }
        }
      } catch (error) {
        console.log("error in stock check", error);
        toast.error("Error checking stock. Please try again.");
      }
    }
  };

  const decrement = async (index) => {
    if (cartItems[index]?.quantity > 1) {
      const updatedCartItems = [...cartItems]; // Create a new array
      updatedCartItems[index].quantity -= 1;
      setCartItems(updatedCartItems);
      encryptData(updatedCartItems);
      setRenderMe(!renderMe);
    }
  };

  const removeItem = async (index) => {
    removePromo();
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);

    if (updatedCartItems?.length == 0) {
      setCartItems([]);
      localStorage.removeItem("myCartMain");
      setRenderMe(!renderMe);
    }

    setCartItems(updatedCartItems);
    setRenderMe(!renderMe);
    encryptData(updatedCartItems);
    setPromoCode("");
  };

  const selectPayment = async (id) => {
    const findIndex = settingsData?.paymentData?.findIndex((e) => e._id == id);
    settingsData.paymentData.map((item, index) => {
      return (item["selected"] = false);
    });
    if (id !== "amar_pay") {
      if (findIndex > -1) {
        settingsData.paymentData[findIndex]["selected"] = true;
        setPaymentOption(settingsData?.paymentData[findIndex]?.name);
        setPaymentInfo(settingsData?.paymentData[findIndex]);
      } else {
        setPaymentOption("cash");
        setPhone("");
        setTransaction("");
      }
      setRenderMe(!renderMe);
    } else {
      setPaymentOption("amar_pay");
      setPaymentInfo({});
      setPhone("");
      setTransaction("");
    }
  };

  useEffect(() => {
    const generateCheckoutPayload = (cartItems) => {
      const items = cartItems.map((item) => {
        const price = item?.isVariant
          ? item?.variation?.flashPrice || item?.variation?.sellingPrice
          : item?.price;

        return {
          item_id: item?.sku,
          item_name: item?.name,
          discount: item?.variation?.regularPrice || 0,
          index: cartItems.indexOf(item),
          item_brand: item?.brand?.name || "",
          item_category: item?.categories?.length
            ? item?.categories[0]?.name
            : "",
          price: price,
          quantity: item?.quantity || 1,
        };
      });

      const productInfo = {
        event: "begin_checkout",
        eventID: null,
        plugin: "StoreX",
        currency: "BDT", // Updated to correct currency code
        value: items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ), // Total value of the cart
        customer: {
          id: 0, // Placeholder, should be replaced with actual customer ID if available
          billing: {
            first_name: "",
            last_name: "",
            company: "",
            address_1: "",
            address_2: "",
            city: "",
            zone: "",
            postcode: "",
            country: "BD",
            email: "",
            phone: "",
          },
        },
        items: items,
      };

      return productInfo;
    };

    // Check if cartItems is not empty and has been updated
    if (cartItems?.length > 0) {
      const productInfo = generateCheckoutPayload(cartItems);
      setGtmCheckout(productInfo);
    }
  }, [cartItems]);

  return (
    <div>
      {gtmCheckout && <Gtm data={gtmCheckout} />}

      <div className="bg-white py-3 xls:mt-1 xms:mt-1 xs:mt-1 px-6 xls:px-4 xms:px-2  xs:px-1 rounded-md">
        <p className="text-lg font-semibold dark:text-black">
          {" "}
          প্রোডাক্ট ডিটেইল
        </p>

        <div className="flex justify-between items-center border-dashed border-b-2 border-gray-300 pt-4">
          <p className="text-xs font-bold dark:text-black">প্রোডাক্ট নাম</p>
          <p className="text-black font-bold tracking-wider text-xs">
            বিক্রয় মূল্য
          </p>
        </div>

        <div className="mt-2 space-y-3 h-auto">
          {cartItems?.map((item, index) => (
            <div key={index} className="grid grid-cols-12 shadow-md p-1 mt-1">
              <div className="col-span-10">
                <div className="flex space-x-2 items-center">
                  {item?.isVariant ? (
                    <div className="h-[60px] w-[60px]">
                      <Image
                        width={0}
                        height={0}
                        src={
                          item?.variation?.images?.length
                            ? `${imageBasePath}/${item?.variation?.images[0]}`
                            : item?.image?.length
                              ? `${imageBasePath}/${item?.image[0]}`
                              : "/image/product/placeholder_600x.webp"
                        }
                        alt="product"
                        sizes="100"
                        className="w-full h-full rounded"
                      />
                    </div>
                  ) : (
                    <div className="h-[60px] w-[60px]">
                      <Image
                        width={0}
                        height={0}
                        src={
                          item?.image?.length
                            ? `${imageBasePath}/${item?.image[0]}`
                            : "/image/product/placeholder_600x.webp"
                        }
                        alt="product"
                        sizes="100"
                        className="w-full h-full rounded"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-sm xls:text-xs xms:text-xs xs:text-xs">
                      {item?.name}
                    </p>
                    <div className="flex flex-wrap items-center text-sm text-gray-500 gap-x-3 gap-y-1 mt-1">
                      {item?.variation?.attributeOpts?.map((opt, idx) => (
                        <span
                          key={idx}
                          className="bg-gray-100 px-2 py-1 rounded text-xs border border-gray-300"
                        >
                          {opt?.attributeName}: <span className="font-medium">{opt?.name}</span>
                        </span>
                      ))}
                    </div>


                    <div className="flex items-center space-x-2 mt-2">
                      <p className="font-semibold text-sm xls:text-xs xms:text-xs xs:text-xs">
                        Qty:
                      </p>
                      <div className="flex items-center border border-gray-300 rounded-sm">
                        <button
                          onClick={() => decrement(index)}
                          className="p-2 xs:p-2 xms:p-2 xls:p-2 border-r border-gray-300"
                        >
                          <svg
                            className="h-3 w-3 fill-current text-gray-400 "
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M5 11V13H19V11H5Z"></path>
                          </svg>
                        </button>

                        <div>
                          <input
                            type="text"
                            className="w-[40px]  pl-3 outline-none"
                            value={item?.quantity}
                            readOnly
                          />
                        </div>
                        <button
                          onClick={() =>
                            increment(index, item?.stock, item?.quantity, item)
                          }
                          className="p-2 border-l border-gray-300 cursor-pointer"
                        >
                          <svg
                            className="h-3 w-3 fill-current text-gray-400 "
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                          >
                            <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-span-2 grid justify-end">
                <p className="font-bold text-sm xls:text-xs xms:text-xs xs:text-xs">
                  TK. {item?.price * item?.quantity}
                </p>

                <div>
                  <button
                    onClick={() => removeItem(index)}
                    className="underline font-semibold capitalize pt-5 text-sm"
                  >
                    remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center py-2 border-t-2 border-dashed border-gray-300">
            <p className="text-sm font-bold text-black">সাব-টোটাল (+)</p>

            <p className="font-bold text-black xls:text-sm xms:text-sm xs:text-xs">
              TK. {subTotal}
            </p>
          </div>
          {isPromo && !isDeliveryPromo ? (
            <div className="flex justify-between items-center py-2 border-t-2 border-dashed border-gray-300">
              <p className="text-sm font-bold text-black">
                প্রমো-কোড ব্যাবহারে ছাড় পেয়েছেন (-)
              </p>
              <AiFillDelete
                onClick={() => removePromo()}
                className="cursor-pointer"
                color="red"
                size={25}
              />

              <p className="font-bold text-black xls:text-sm xms:text-sm xs:text-xs">
                TK. {promoDiscount}
              </p>
            </div>
          ) : null}
          {isDeliveryPromo ? (
            <div className="flex justify-between items-center py-2 border-t-2 border-dashed border-gray-300">
              <p className="text-sm font-bold text-black">
                প্রমো-কোড ব্যাবহারে ডেলিভারি চার্জ ছাড় পেয়েছেন (-)
              </p>
              <AiFillDelete
                onClick={() => removePromo()}
                className="cursor-pointer"
                color="red"
                size={25}
              />
            </div>
          ) : null}

          <div className="flex justify-between items-center py-2 border-t-2 border-b-2 border-dashed border-gray-300">
            <p className="text-sm font-bold text-black">ডেলিভারি চার্জ (+)</p>

            <div>
              {deliveryOption?.type == "inside" ? (
                <div className="flex items-center">
                  <label
                    htmlFor="inside"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="bg-white rounded-full w-4 h-4 flex flex-shrink-0 justify-center items-center relative">
                      <input
                        checked={deliveryOption === "inside"}
                        type="radio"
                        id="inside"
                        name="deliveryOption"
                        className="appearance-none focus:opacity-100 focus:ring-indigo-700 focus:outline-none border rounded-full border-gray-400 absolute cursor-pointer w-full h-full checked:border-none"
                      // onChange={() =>
                      //   setDeliveryOption({
                      //     type: "inside",
                      //     amount: deliveryData?.inside?.amount,
                      //   })
                      // }
                      />
                      <div
                        className={`check-icon ${deliveryOption?.type === "inside" ? "block" : "hidden"
                          } border-4 border-primary rounded-full w-full h-full z-1`}
                      ></div>
                    </div>
                    <span className="ml-2 font-semibold text-sm xms:text-xs xs:text-xs">
                      ঢাকা সিটির ভিতরে
                    </span>

                    <span className="font-bold text-primary text-sm ml-2">
                      TK. {isDeliveryPromo ? 0 : (Number(deliveryData?.inside?.amount) || 0)}
                    </span>
                  </label>
                </div>
              ) : (
                <div className="flex items-center pt-2">
                  <label
                    htmlFor="outside"
                    className="flex items-center cursor-pointer"
                  >
                    <div className="bg-white rounded-full w-4 h-4 flex flex-shrink-0 justify-center items-center relative">
                      <input
                        checked={deliveryOption === "outside"}
                        type="radio"
                        id="outside"
                        name="deliveryOption"
                        className="appearance-none focus:opacity-100 focus:ring-indigo-700 focus:outline-none border rounded-full border-gray-400 absolute cursor-pointer w-full h-full checked:border-none"
                      // onChange={() =>
                      //   setDeliveryOption({
                      //     type: "outside",
                      //     amount: deliveryData?.outside?.amount,
                      //   })
                      // }
                      />
                      <div
                        className={`check-icon ${deliveryOption?.type === "outside"
                            ? "block"
                            : "hidden"
                          } border-4 border-secondary rounded-full w-full h-full z-1`}
                      ></div>
                    </div>
                    <span className="ml-2 font-semibold text-sm xms:text-xs xs:text-xs">
                      ঢাকা সিটির বাহিরে
                    </span>

                    <span className="font-bold text-secondary text-sm ml-2">
                      TK. {isDeliveryPromo ? 0 : (Number(deliveryData?.outside?.amount) || 0)}
                    </span>
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center py-2 border-t-2 border-dashed border-gray-300">
            <p className="text-sm font-bold text-black">টোটাল</p>

            <p className="font-bold text-black xls:text-sm xms:text-sm xs:text-xs">
              TK.{" "}
              {(() => {
                const deliveryAmount = Number(deliveryOption?.amount) || 0;
                const promoDiscountAmount = Number(promoDiscount) || 0;
                const subTotalAmount = Number(subTotal) || 0;
                const total = isDeliveryPromo
                  ? subTotalAmount
                  : subTotalAmount + deliveryAmount - promoDiscountAmount;
                return isNaN(total) ? 0 : total;
              })()}
            </p>
          </div>

          <div className="flex items-center ">
            <label htmlFor="cash" className="flex items-center cursor-pointer">
              <div className="bg-white rounded-full w-4 h-4 flex flex-shrink-0 justify-center items-center relative">
                <input
                  checked={paymentOption === "cash"}
                  type="radio"
                  id="cash"
                  name="paymentOption"
                  className="appearance-none focus:opacity-100 focus:ring-indigo-700 focus:outline-none border rounded-full border-gray-400 absolute cursor-pointer w-full h-full checked:border-none"
                  onChange={() => selectPayment()}
                />
                <div
                  className={`check-icon ${paymentOption === "cash" ? "block" : "hidden"
                    } border-4 border-secondary rounded-full w-full h-full z-1`}
                ></div>
              </div>
              <span className="ml-2 font-semibold text-sm">
                Cash on delivery
              </span>

              <div className="h-[30px] w-[30px] ml-1">
                <Image src={Cash} alt="cash-logo" />
              </div>
            </label>
          </div>

          <div className="bg-gray-200 rounded-md py-3">
            <span className="font-extrabold text-black text-sm pl-3">
              পণ্য হাতে পেয়ে সম্পূর্ণ মূল্য পরিশোধ করতে হবে
            </span>
          </div>

          {settingsData?.isOnlinePayHide ? (
            <>
              <>
                {settingsData?.paymentData?.map((item, index) => (
                  <div key={index} className="flex items-center mt-5">
                    <label
                      htmlFor="bkash"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="bg-white rounded-full w-4 h-4 flex flex-shrink-0 justify-center items-center relative">
                        <input
                          checked={item?.selected}
                          type="radio"
                          id="bkash"
                          name="paymentOption"
                          className="appearance-none focus:opacity-100 focus:ring-indigo-700 focus:outline-none border rounded-full border-gray-400 absolute cursor-pointer w-full h-full checked:border-none"
                          onChange={() => {
                            selectPayment(item?._id);
                          }}
                        />
                        <div
                          className={`check-icon ${item?.selected ? "block" : "hidden"
                            } border-4 border-secondary rounded-full w-full h-full z-1`}
                        ></div>
                      </div>
                      <div className="flex items-center">
                        <span className="mx-2 font-semibold text-sm">
                          {item?.name}
                        </span>
                        {item?.image ? (
                          <Image
                            alt="logo"
                            className="rounded-full"
                            width={20}
                            height={20}
                            src={`${imageBasePath}/${item?.image}`}
                          />
                        ) : null}
                      </div>
                    </label>
                  </div>
                ))}
              </>

              {Object.keys(paymentInfo)?.length ? (
                <div className="py-5 ">
                  <div className="bg-[#F3F4F6] p-5 rounded-md">
                    <h5 className="font-bold">
                      {paymentInfo?.name} : {paymentInfo?.phone}
                    </h5>
                    <div className="mt-3">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: paymentInfo?.description,
                        }}
                      ></div>
                    </div>
                    <div className="mt-5 py-4 flex items-center justify-between border-t-[1px]  border-b-[1px]">
                      <p className="font-bold">
                        Your {paymentInfo?.name} Number
                        <span className="text-red-700">*</span>
                      </p>
                      <input
                        className="bg-white w-[50%] pl-2 h-[40px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
                        onChange={(e) => setPayPhone(e.target.value)}
                        value={payPhone}
                      />
                    </div>
                    <div className="mt-2 py-4 flex items-center justify-between border-b-[1px]">
                      <p className="font-bold">
                        {paymentInfo?.name} transaction Id
                        <span className="text-red-700">*</span>
                      </p>
                      <input
                        className="bg-white w-[50%] pl-2 h-[40px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
                        onChange={(e) => setTransaction(e.target.value)}
                        value={transaction}
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {/* <div className="flex items-center mt-1">
              <label
                htmlFor="amar_pay"
                className="flex items-center cursor-pointer"
              >
                <div className="bg-white rounded-full w-4 h-4 flex flex-shrink-0 justify-center items-center relative">
                  <input
                    checked={paymentOption === "amar_pay"}
                    type="radio"
                    id="amar_pay"
                    name="paymentOption"
                    className="appearance-none focus:opacity-100 focus:ring-indigo-700 focus:outline-none border rounded-full border-gray-400 absolute cursor-pointer w-full h-full checked:border-none"
                    onChange={() => selectPayment("amar_pay")}
                  />
                  <div
                    className={`check-icon ${
                      paymentOption === "amar_pay" ? "block" : "hidden"
                    } border-4 border-secondary rounded-full w-full h-full z-1`}
                  ></div>
                </div>

                <div className="h-[60px] w-[90px] ml-2">
                  <Image
                    src={Amarpay}
                    className="h-full w-full object-contain"
                    alt="logo"
                  />
                </div>
              </label>
            </div> */}
              <div className="bg-gray-200 rounded-md py-3">
                <span className="font-extrabold text-black text-sm pl-3">
                  বিকাশ, নগদ অথবা ব্যাংকের মাধ্যমে পেমেন্ট করুন ।
                </span>
              </div>
            </>
          ) : null}

          {settingsData?.isPromoHide ? (
            <CouponSection
              applyPromo={applyPromo}
              setPromoCode={setPromoCode}
              promoCode={promoCode}
            />
          ) : null}

          <div
            onClick={() => createOrder()}
            id="purchase"
            className="w-full bg-secondary flex items-center justify-center py-3 mt-5 cursor-pointer"
          >
            <button className="flex items-center space-x-2">
              {loading ? null : (
                <div>
                  <FaLock size={16} className="text-white" />
                </div>
              )}

              <div className="text-white font-bold text-sm">
                {!loading ? (
                  `অর্ডারটি কনফর্ম করুন TK.
                 ${(() => {
                   const deliveryAmount = Number(deliveryOption?.amount) || 0;
                   const promoDiscountAmount = Number(promoDiscount) || 0;
                   const subTotalAmount = Number(subTotal) || 0;
                   const total = isDeliveryPromo
                     ? subTotalAmount
                     : subTotalAmount + deliveryAmount - promoDiscountAmount;
                   return isNaN(total) ? 0 : total;
                 })()}`
                ) : (
                  <div className="flex items-center justify-center">
                    <Triangle
                      visible={true}
                      height="40"
                      width="50"
                      color="#fff"
                      ariaLabel="triangle-loading"
                    />
                  </div>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>


    </div>
  );
};

export default CartoverviewSection;
