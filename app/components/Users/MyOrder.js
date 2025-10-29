"use client"

import request from "@/lib/request";
import moment from "moment";
import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import { Triangle } from "react-loader-spinner";
import OrderModal from "./SingleOrderModal";
import { useStatus } from "@/context/contextStatus";
import OrderReviewModal from './reviewModal';
const MyOrder = () => {
 
  const cookie = parseCookies()

  const [openModal, setOpenModal] = useState(false)
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderList, setOrderList] = useState([])
  const [selectedOrderInfo, setSelectedOrderInfo] = useState({})


  const user = cookie?.hasOwnProperty("userInfo")
  ? JSON.parse(cookie?.userInfo)
  : {};
 const [loading, setLoading] = useState(true);

 const {token} = useStatus();


   const handleOrderDetails = (val) => {
     setOrderModalOpen(true);
     setSelectedOrderInfo(val)
   };

   useEffect(() => {
    if(token){
       const getOrders = async () => {
         try {
           let res = await request(`admin-order/customer/list?page=1&limit=10`);
           if (res?.data?.success) {
             setOrderList(res?.data?.data);
             setLoading(false);
           }
         } catch (error) {
           console.log("err in getOrders");
         }
       };
       getOrders();

    }
    
   }, [token]);



  return (
    <>
      <div className="bg-white p-3 rounded-md">
        <div className="flex space-x-2 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path d="M7.83 20A3.001 3.001 0 1 1 4 16.17V7.83A3.001 3.001 0 1 1 7.83 4h8.34A3.001 3.001 0 1 1 20 7.83v8.34A3.001 3.001 0 1 1 16.17 20H7.83zm0-2h8.34A3.008 3.008 0 0 1 18 16.17V7.83A3.008 3.008 0 0 1 16.17 6H7.83A3.008 3.008 0 0 1 6 7.83v8.34A3.008 3.008 0 0 1 7.83 18zM5 6a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm14 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2zM5 20a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />
          </svg>
          <h1 className="font-semibold text-2xl">
            <span  className="text-black">My Order</span>{" "}
          </h1>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              paddingTop: "170px",
              paddingBottom: "170px",
            }}
          >
            <Triangle
              visible={true}
              height="80"
              width="80"
              color="#000"
              ariaLabel="triangle-loading"
            />
          </div>
        ) : (
          <div className="flex flex-col  rounded-lg mt-4 overflow-hidden overflow-x-auto">
            <div className=" sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div>
                  {orderList?.length > 0 ? (
                    <table className="min-w-full text-left text-sm font-light">
                      <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-white dark:text-gray-400">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-base">
                            Invoice no
                          </th>
                          <th scope="col" className="px-6 py-3 text-base">
                            Date
                          </th>
                          <th scope="col" className="px-6 py-3 text-base">
                            Grand total
                          </th>
                          <th scope="col" className="px-6 py-3 text-base">
                            Payment
                          </th>
                          <th scope="col" className="px-6 py-3 text-base">
                            Status
                          </th>
                          <th scope="col" className="px-6 py-3 text-base">
                            Action
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-black">
                        {orderList?.map((item, index) => (
                          <tr
                            key={index}
                            className="bg-white border-b dark:bg-white dark:border-gray-700"
                          >
                            <th
                              scope="row"
                              className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-gray-700"
                            >
                              {item?.serialId}
                            </th>
                            <td className="px-6 py-4">
                              {moment(item?.createdAt).format("ll")}
                            </td>
                            <td className="px-6 py-4">
                              {item?.customerCharge?.totalBill} tk
                            </td>
                            <td className="px-6 py-4 capitalize">
                              {item?.payment?.paymentType}
                            </td>
                            <td class="px-6 py-4">
                              {item?.orderStatus?.length > 0 ? (
                                <div>
                                  {item?.orderStatus[
                                    item?.orderStatus?.length - 1
                                  ]?.status == "CANCELED" ? (
                                    <p className="bg-red-400 py-1 text-[11px] xs:px-2 rounded-full text-center text-sm text-white font-semibold">
                                      {
                                        item?.orderStatus[
                                          item?.orderStatus?.length - 1
                                        ].status
                                      }
                                    </p>
                                  ) : item?.orderStatus[
                                      item?.orderStatus?.length - 1
                                    ]?.status == "DELIVERED" ? (
                                    <div>
                                      <p className="bg-green-400 py-1 text-[11px] xs:px-2 rounded-full text-center text-sm text-white font-semibold">
                                        {
                                          item?.orderStatus[
                                            item?.orderStatus?.length - 1
                                          ].status
                                        }
                                      </p>
                                    </div>
                                  ) : (
                                    <p className="text-sm text-center bg-black text-white">
                                      {
                                        item?.orderStatus[
                                          item?.orderStatus?.length - 1
                                        ]?.status
                                      }
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm text-center bg-black text-white px-2 py-1 rounded-full uppercase font-semibold">
                                  pending
                                </p>
                              )}
                            </td>
                            <td className="flex space-x-3 px-6 py-4">
                              <button
                                className="px-3 bg-green-500 text-white font-medium text-sm py-2 tracking-wider"
                                onClick={() => handleOrderDetails(item)}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-2xl font-semibold tracking-wider text-black capitalize text-center py-10">
                      no data found
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <OrderModal
        orderModalOpen={orderModalOpen}
        setOrderModalOpen={setOrderModalOpen}
        selectedOrderInfo={selectedOrderInfo}
        setOpenModal={setOpenModal}
      />

      <OrderReviewModal openModal={openModal} setOpenModal={setOpenModal}/>
    </>
  );
};

export default MyOrder;
