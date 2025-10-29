"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { imageBasePath } from "@/config";

const OrderModal = ({
  orderModalOpen,
  setOrderModalOpen,
  selectedOrderInfo,
  setOpenModal,
}) => {
  const handleClose = () => {
    setOrderModalOpen(false);
  };

  const [findIndex, setFindIndex] = useState(null);

  const arrStatus = [
    {
      id: 1,
      name: "PENDING",
      icon: (
        <svg
          className="fill-current text-white"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M10.478 11.632L5.968 4.56l1.931-.518 6.951 6.42 5.262-1.41a1.5 1.5 0 0 1 .776 2.898L5.916 15.96l-.776-2.898.241-.065 2.467 2.445-2.626.704a1 1 0 0 1-1.133-.48L1.466 10.94l1.449-.388 2.466 2.445 5.097-1.366zM4 19h16v2H4v-2z" />
        </svg>
      ),
    },

    {
      id: 2,
      name: "CONFIRM",
      icon: (
        <svg
          className="fill-current text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z" />
        </svg>
      ),
    },

    {
      id: 3,
      name: "SHIPPED",
      icon: (
        <svg
          className="fill-current text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M7.617 8.712l3.205-2.328A1.995 1.995 0 0 1 12.065 6a2.616 2.616 0 0 1 2.427 1.82c.186.583.356.977.51 1.182A4.992 4.992 0 0 0 19 11v2a6.986 6.986 0 0 1-5.402-2.547l-.697 3.955 2.061 1.73 2.223 6.108-1.88.684-2.04-5.604-3.39-2.845a2 2 0 0 1-.713-1.904l.509-2.885-.677.492-2.127 2.928-1.618-1.176L7.6 8.7l.017.012zM13.5 5.5a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-2.972 13.181l-3.214 3.83-1.532-1.285 2.976-3.546.746-2.18 1.791 1.5-.767 1.681z" />
        </svg>
      ),
    },
    {
      id: 4,
      name: "DELIVERED",
      icon: (
        <svg
          className="fill-current text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M7 5V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4zm13 8H4v6h16v-6zm0-6H4v4h3V9h2v2h6V9h2v2h3V7zM9 3v2h6V3H9z" />
        </svg>
      ),
    },
    {
      id: 5,
      name: "CANCELED",
      icon: (
        <svg
          className="fill-current text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M7 5V2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v3h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4zm13 8H4v6h16v-6zm0-6H4v4h3V9h2v2h6V9h2v2h3V7zM9 3v2h6V3H9z" />
        </svg>
      ),
    },
  ];


  useEffect(() => {
    if (selectedOrderInfo?.orderStatus?.length > 0) {
      let index = arrStatus.findIndex(
        (item) =>
          item?.name ==
          selectedOrderInfo?.orderStatus[
            selectedOrderInfo?.orderStatus?.length - 1
          ]?.status
      );

      setFindIndex(index);
    }
  }, [selectedOrderInfo?.orderStatus]);

  return (
    <Transition appear show={orderModalOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-40 overflow-y-auto bg-opacity-60 bg-black dark:text-black"
        onClose={() => setOrderModalOpen(false)}
      >
        <div className=" min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500 translate-y-0"
            enterFrom="opacity-0 duration-300 scale-95 translate-y-0"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-[800px] min-h-[300px] p-4 xls:p-2 xms:p-2 xs:p-1 my-8 overflow-hidden text-left align-middle transition-all transform bg-gray-100 rounded-lg shadow-xl">
              <div>
                <div className="py-4 bg-gray-100 flex flex-col justify-center max-w-[45rem] mx-auto">
                  <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center text-3xl font-extrabold text-gray-900 relative">
                      <div
                        className="absolute top-[-20px] right-[-5px]"
                        onClick={() => handleClose()}
                      >
                        <svg
                          className="fill-current text-red-500 cursor-pointer"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="28"
                          height="28"
                        >
                          <path fill="none" d="M0 0h24v24H0z" />
                          <path d="M12 10.586l4.95-4.95 1.414 1.414-4.95 4.95 4.95 4.95-1.414 1.414-4.95-4.95-4.95 4.95-1.414-1.414 4.95-4.95-4.95-4.95L7.05 5.636z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-100 my-5">
                    <div>
                      <p className="font-semibold tracking-wider font-body text-lg">
                        Order status
                      </p>

                      <div className="flex items-center justify-between">
                        {selectedOrderInfo?.orderStatus?.length > 0 ? (
                          <p className="pt-3 text-red-600 text-lg font-semibold font-body uppercase">
                            {selectedOrderInfo?.orderStatus?.length > 0 &&
                              selectedOrderInfo?.orderStatus[
                                selectedOrderInfo?.orderStatus?.length - 1
                              ].status}
                          </p>
                        ) : (
                          <p className="pt-3 text-red-600 text-lg font-semibold font-body uppercase">
                            pending
                          </p>
                        )}
                        <div
                          onClick={() => {
                            setOpenModal(true);
                            setOrderModalOpen(false);
                          }}
                          className="pt-3 text-black text-lg font-semibold font-body uppercase cursor-pointer"
                        >
                          {selectedOrderInfo?.orderStatus?.length > 0 &&
                          selectedOrderInfo?.orderStatus[
                            selectedOrderInfo?.orderStatus?.length - 1
                          ].status == "DELIVERED" ? (
                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-2 rounded focus:outline-none focus:ring focus:ring-blue-400">
                              Rate Us
                            </button>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>

                      <div className="xxl:flex xl:flex lg:flex md:flex sm:flex  xs:hidden xls:hidden xms:hidden items-center mt-3">
                        {arrStatus.map((item, index, arr) => (
                          <>
                            {index <= findIndex ? (
                              <div className="flex items-center text-black relative">
                                <div className="bg-gray-800 rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-black flex justify-center items-center">
                                  <svg
                                    className="fill-current text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                  >
                                    <path fill="none" d="M0 0h24v24H0z" />
                                    <path d="M11.602 13.76l1.412 1.412 8.466-8.466 1.414 1.414-9.88 9.88-6.364-6.364 1.414-1.414 2.125 2.125 1.413 1.412zm.002-2.828l4.952-4.953 1.41 1.41-4.952 4.953-1.41-1.41zm-2.827 5.655L7.364 18 1 11.636l1.414-1.414 1.413 1.413-.001.001 4.951 4.951z" />
                                  </svg>
                                </div>
                                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-gray-800">
                                  {item?.name}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center text-gray-800 relative">
                                <div className="bg-white rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-black flex justify-center items-center">
                                  <svg
                                    className="fill-current text-black"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width="24"
                                    height="24"
                                  >
                                    <path fill="none" d="M0 0h24v24H0z" />
                                    <path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z" />
                                  </svg>
                                </div>
                                <div className="absolute top-0 -ml-10 text-center mt-16 w-32 text-xs font-medium uppercase text-black">
                                  {item?.name}
                                </div>
                              </div>
                            )}

                            {index === arr?.length - 1 ? null : index <=
                              selectedOrderInfo?.orderStatus?.indexOf(
                                selectedOrderInfo?.orderStatus[
                                  selectedOrderInfo?.orderStatus?.length - 1
                                ]
                              ) -
                                2 ? (
                              <div className="flex-auto  border-t-2 transition duration-500 ease-in-out border-black"></div>
                            ) : (
                              <div className="flex-auto  border-t-2 transition duration-500 ease-in-out border-gray-300"></div>
                            )}
                          </>
                        ))}
                      </div>

                      <div className="xxl:hidden xl:hidden lg:hidden md:hidden sm:hidden xs:block xls:block xms:block">
                        {arrStatus?.map((item, index, arr) => (
                          <>
                            {index <= findIndex ? (
                              <div>
                                <div className="flex items-center text-black ">
                                  <div className="bg-black rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-black flex justify-center items-center">
                                    <svg
                                      className="fill-current text-white"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      width="24"
                                      height="24"
                                    >
                                      <path fill="none" d="M0 0h24v24H0z" />
                                      <path d="M11.602 13.76l1.412 1.412 8.466-8.466 1.414 1.414-9.88 9.88-6.364-6.364 1.414-1.414 2.125 2.125 1.413 1.412zm.002-2.828l4.952-4.953 1.41 1.41-4.952 4.953-1.41-1.41zm-2.827 5.655L7.364 18 1 11.636l1.414-1.414 1.413 1.413-.001.001 4.951 4.951z" />
                                    </svg>
                                  </div>
                                  <div className="text-center text-xs font-medium uppercase text-black">
                                    {item?.name}
                                  </div>
                                </div>
                                {index === arr?.length - 1 ? null : index <=
                                  selectedOrderInfo?.orderStatus?.indexOf(
                                    selectedOrderInfo?.orderStatus[
                                      selectedOrderInfo?.orderStatus?.length - 1
                                    ]
                                  ) -
                                    2 ? (
                                  <div className="flex-auto  border-t-2 transition duration-500 ease-in-out border-black"></div>
                                ) : (
                                  <div className="h-8 w-[2px] bg-gray-400 ml-[20px]"></div>
                                )}
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center text-black ">
                                  <div className="bg-white rounded-full transition duration-500 ease-in-out h-12 w-12 py-3 border-2 border-black flex justify-center items-center">
                                    <svg
                                      className="fill-current text-black"
                                      xmlns="http://www.w3.org/2000/svg"
                                      viewBox="0 0 24 24"
                                      width="24"
                                      height="24"
                                    >
                                      <path fill="none" d="M0 0h24v24H0z" />
                                      <path d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z" />
                                    </svg>
                                  </div>
                                  <div className=" text-xs font-medium uppercase text-black">
                                    {item?.name}
                                  </div>
                                </div>
                                {index === arr?.length - 1 ? null : index <=
                                  selectedOrderInfo?.orderStatus?.indexOf(
                                    selectedOrderInfo?.orderStatus[
                                      selectedOrderInfo?.orderStatus?.length - 1
                                    ]
                                  ) -
                                    2 ? (
                                  <div className="flex-auto  border-t-2 transition duration-500 ease-in-out border-black"></div>
                                ) : (
                                  <div className="h-8 w-[2px] bg-gray-400 ml-[20px]"></div>
                                )}
                              </div>
                            )}
                          </>
                        ))}
                      </div>

                      <div className="px-4 xls:px-1 xms:px-1 xs:px-1 py-4 font-body border-2 border-gray-200 rounded-lg mt-10">
                        <div className="grid grid-cols-3">
                          <div className="grid justify-start xls:text-xs xms:text-xs xs:text-xs">
                            <p className="text-gray-500 font-semibold">
                              Invoice no
                            </p>
                            <p className="font-semibold xls:text-xs xms:text-xs xs:text-xs">
                              {selectedOrderInfo?.serialId}
                            </p>
                          </div>

                          <div className="grid justify-center">
                            <p className="text-gray-500 font-semibold xls:text-xs xms:text-xs xs:text-xs">
                              Order Date
                            </p>
                            <p className="font-semibold xls:text-xs xms:text-xs xs:text-xs">
                              {moment(selectedOrderInfo?.createdAt).format(
                                "ll"
                              )}
                            </p>
                          </div>
                          <div className="grid justify-end">
                            <p className="text-gray-500 font-semibold xls:text-xs xms:text-xs xs:text-xs">
                              Payment method
                            </p>
                            <p className="font-semibold xls:text-xs xms:text-xs xs:text-xs capitalize">
                              {selectedOrderInfo?.payment?.paymentType}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 font-body">
                        <p className="tracking-wider">Order Summary</p>
                        {selectedOrderInfo?.products?.map((item, index) => (
                          <div
                            key={index}
                            className="border-2 border-gray-200 rounded-lg mt-3"
                          >
                            <div className="grid grid-cols-12 px-2 py-2 border-b-2 border-gray-100 ">
                              {item?.isVariant ? (
                                <div className="h-[80px] w-[80px] col-span-2 ">
                                  <Image
                                    width={200}
                                    height={200}
                                    src={
                                      item?.variation?.images?.length
                                        ? `${imageBasePath}/${item?.variation?.images[0]}`
                                        : "/image/product/placeholder_600x.webp"
                                    }
                                    alt="product"
                                  />
                                </div>
                              ) : (
                                <div className="h-[80px] w-[80px]  col-span-2">
                                  <Image
                                    width={200}
                                    height={200}
                                    src={
                                      item?.product?.galleryImage?.length
                                        ? `${imageBasePath}/${item?.product?.galleryImage[0]}`
                                        : "/image/product/placeholder_600x.webp"
                                    }
                                    alt="product"
                                  />
                                </div>
                              )}
                              <p className="font-semibold tracking-wider text-black col-span-5 xls:text-xs xms:text-xs xs:text-xs flex items-center ">
                                {item?.name}
                              </p>

                              <p className="text-black col-span-1 xls:text-xs xms:text-xs xs:text-xs flex items-center ">
                                {item?.quantity}
                              </p>
                              <h2 className="font-semibold text-base text-black col-span-3 xls:text-xs xms:text-xs xs:text-xs flex items-center  ">
                                TK. {item?.price}
                              </h2>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 font-body">
                        <p className="tracking-wider font-bold dark:text-black">
                          Payment Details
                        </p>
                        <div className="border-2 border-gray-200 rounded-lg p-4 mt-3">
                          <div className="flex justify-between items-center py-2 border-b-2 border-gray-100">
                            <p className="font-medium dark:text-black">
                              Subtotal
                            </p>
                            <h2 className="font-semibold text-base dark:text-black">
                              ৳{" "}
                              {
                                selectedOrderInfo?.customerCharge
                                  ?.totalProductPrice
                              }
                            </h2>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b-2 border-gray-100">
                            <p className="font-medium dark:text-black">
                              Shipping
                            </p>
                            <h2 className="font-semibold text-base dark:text-black">
                              ৳{" "}
                              {
                                selectedOrderInfo?.customerCharge
                                  ?.deliveryCharge
                              }
                            </h2>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b-2 border-gray-100">
                            <p className="font-medium dark:text-black">
                              Discount
                            </p>
                            <h2 className="font-semibold text-base dark:text-black">
                              ৳{" "}
                              {selectedOrderInfo?.customerCharge?.discountPrice}
                            </h2>
                          </div>

                          <div className="flex justify-between items-center py-2 border-b-2 border-gray-100">
                            <p className="font-medium dark:text-black">
                              Grand Total
                            </p>
                            <h2 className="font-semibold text-base dark:text-black">
                              ৳ {selectedOrderInfo?.customerCharge?.totalBill}
                            </h2>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b-2 border-gray-100">
                            <p className="font-medium dark:text-black">Paid</p>
                            <h2 className="font-semibold text-base dark:text-black">
                              ৳ {selectedOrderInfo?.customerCharge?.totalPayTk}
                            </h2>
                          </div>
                          <div className="flex justify-between items-center py-2 border-b-2 border-gray-100">
                            <p className="font-medium dark:text-black">Due</p>
                            <h2 className="font-semibold text-base dark:text-black">
                              ৳{" "}
                              {
                                selectedOrderInfo?.customerCharge
                                  ?.remainingTkPay
                              }
                            </h2>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default OrderModal;
