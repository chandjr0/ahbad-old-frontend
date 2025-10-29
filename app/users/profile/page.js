"use client";
import BreadCrumbs from "@/app/components/Common/Breadcumb";
import { useStatus } from "@/context/contextStatus";
import request from "@/lib/request";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from "nookies";
import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import { FaPrint } from "react-icons/fa";
import PrintInvoice from "@/app/components/PrintInvoice/PrintInvoice";

const Profile = () => {
  const cookies = parseCookies();
  const { token, setToken } = useStatus();
  const router = useRouter();
  const [userOrders, setUserOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalData: 0,
    limit: 25
  });
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);

  const user = cookies?.hasOwnProperty("userInfo")
    ? JSON.parse(cookies?.userInfo)
    : null;

  // Check if user is logged in
  useEffect(() => {
    if (!cookies.token) {
      router.push("/users/login");
    } else {
      fetchUserOrders(1);
    }
  }, []);
  
  console.log("cookies", cookies?.token);

  // Fetch user orders with pagination
  const fetchUserOrders = async (page = 1) => {
    setIsLoading(true);
    try {
      const res = await request(`admin-order/customer/list?page=${page}&limit=${pagination.limit}`, cookies?.token);
      
      if (res?.data?.success) {
        setUserOrders(res.data.data || []);
        setPagination({
          currentPage: Number(res.data.metaData.page),
          totalPages: Number(res.data.metaData.totalPage),
          totalData: Number(res.data.metaData.totalData),
          limit: Number(res.data.metaData.limit)
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to fetch orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch single order for printing
  const fetchOrderForPrint = async (serialId) => {
    setLoadingOrder(true);
    try {
      const res = await request(`admin-order/customer/single-order/${serialId}`, cookies?.token);
      if (res?.data?.success) {
        setSelectedOrder(res.data.data);
        setShowPrintModal(true);
      } else {
        toast.error("Failed to load order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error("Failed to load order details");
    } finally {
      setLoadingOrder(false);
    }
  };

  // Handle page change
  const handlePageChange = (page) => {
    fetchUserOrders(page);
  };

  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    // Calculate range of pages to display
    let startPage = Math.max(1, pagination.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust start page if we're at the end of the range
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(Math.max(1, pagination.currentPage - 1))}
        disabled={pagination.currentPage === 1}
        className={`px-3 py-1 mx-1 rounded ${
          pagination.currentPage === 1 
            ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        &laquo;
      </button>
    );
    
    // Page buttons
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-1 mx-1 rounded ${
            i === pagination.currentPage 
              ? "bg-secondary text-white" 
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          {i}
        </button>
      );
    }
    
    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(Math.min(pagination.totalPages, pagination.currentPage + 1))}
        disabled={pagination.currentPage === pagination.totalPages}
        className={`px-3 py-1 mx-1 rounded ${
          pagination.currentPage === pagination.totalPages 
            ? "bg-gray-200 text-gray-500 cursor-not-allowed" 
            : "bg-gray-200 hover:bg-gray-300"
        }`}
      >
        &raquo;
      </button>
    );
    
    return pages;
  };

  // Handle logout
  const handleLogout = () => {
    destroyCookie(null, "token");
    destroyCookie(null, "userInfo");
    setToken(null);
    toast.success("Logged out successfully");
    router.push("/");
  };

  const breadCumbs = [
    { name: "Home", url: "/" },
    { name: "Profile" }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  // Handle print order
  const handlePrintOrder = (serialId) => {
    fetchOrderForPrint(serialId);
  };

  return (
    <div className="bg-white">
      <div className="bg-gray-200 py-4 px-8 xls:px-4 xms:px-4 xs:px-2">
        <BreadCrumbs breadCumbs={breadCumbs} />
      </div>

      <div className="base-container min-h-[600px] py-8 text-black">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="col-span-1 bg-white shadow-md p-4 h-fit">
            <div className="flex flex-col space-y-2">
              <button 
                onClick={() => setActiveTab("profile")}
                className={`p-3 text-left ${activeTab === "profile" ? "bg-secondary text-white" : "bg-gray-100"}`}
              >
                Profile Information
              </button>
              <button 
                onClick={() => {
                  setActiveTab("orders");
                  fetchUserOrders(1);
                }}
                className={`p-3 text-left ${activeTab === "orders" ? "bg-secondary text-white" : "bg-gray-100"}`}
              >
                My Orders
              </button>
              <button 
                onClick={handleLogout}
                className="p-3 bg-red-600 text-white mt-4"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-1 md:col-span-3 bg-white shadow-md p-6">
            {activeTab === "profile" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">My Profile</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-gray-500 mb-1">Full Name</p>
                      <p className="font-semibold">{user?.name || "N/A"}</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded">
                      <p className="text-gray-500 mb-1">Phone Number</p>
                      <p className="font-semibold">{user?.phone || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div>
                <h2 className="text-2xl font-semibold mb-6">My Orders</h2>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
                  </div>
                ) : userOrders.length > 0 ? (
                  <div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full bg-white">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="py-3 px-4 text-left">Order ID</th>
                            <th className="py-3 px-4 text-left">Customer Info</th>
                            <th className="py-3 px-4 text-left">Date</th>
                            <th className="py-3 px-4 text-left">Total</th>
                            <th className="py-3 px-4 text-left">Status</th>
                            <th className="py-3 px-4 text-left">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {userOrders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50">
                              <td className="py-3 px-4">{order.serialId}</td>
                              <td className="py-3 px-4">
                                <div className="text-sm">
                                  <p className="font-medium">{order.deliveryAddress.name}</p>
                                  <p>{order.deliveryAddress.phone}</p>
                                  <p className="text-xs text-gray-500">{order.deliveryAddress.address}</p>
                                  <p className="text-xs text-gray-500">
                                    {order.deliveryAddress.city?.city_name}, {order.deliveryAddress.zone?.zone_name}
                                  </p>
                                </div>
                              </td>
                              <td className="py-3 px-4">{formatDate(order.createdAt)}</td>
                              <td className="py-3 px-4">৳{order.customerCharge?.totalBill}</td>
                              <td className="py-3 px-4">
                                <span 
                                  className={`px-2 py-1 rounded text-xs 
                                    ${order.orderStatus && order.orderStatus.length > 0 && order.orderStatus[order.orderStatus.length - 1]?.status === "PENDING" ? "bg-yellow-100 text-yellow-800" : 
                                      order.orderStatus && order.orderStatus.length > 0 && order.orderStatus[order.orderStatus.length - 1]?.status === "PROCESSING" ? "bg-blue-100 text-blue-800" :
                                      order.orderStatus && order.orderStatus.length > 0 && order.orderStatus[order.orderStatus.length - 1]?.status === "DELIVERED" ? "bg-green-100 text-green-800" :
                                      order.orderStatus && order.orderStatus.length > 0 && order.orderStatus[order.orderStatus.length - 1]?.status === "CANCELED" ? "bg-red-100 text-red-800" :
                                      "bg-gray-100 text-gray-800"
                                    }
                                  `}
                                >
                                  {order.orderStatus && order.orderStatus.length > 0 
                                    ? order.orderStatus[order.orderStatus.length - 1]?.status
                                    : "N/A"
                                  }
                                </span>
                              </td>
                              <td className="py-3 px-4">
                                <button 
                                  onClick={() => handlePrintOrder(order.serialId)}
                                  className="text-secondary hover:text-secondary-dark focus:outline-none"
                                  title="Print Order"
                                  disabled={loadingOrder}
                                >
                                  <FaPrint className="w-5 h-5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    
                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="flex justify-center mt-6">
                        <div className="flex flex-wrap">{renderPagination()}</div>
                      </div>
                    )}
                    
                    <div className="mt-4 text-sm text-gray-500 text-center">
                      Showing {(pagination.currentPage - 1) * pagination.limit + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalData)} of {pagination.totalData} orders
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center bg-gray-50 rounded">
                    <p className="text-gray-500">No orders found. Start shopping now!</p>
                    <Link href="/" className="mt-4 inline-block px-6 py-2 bg-secondary text-white rounded">
                      Shop Now
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Print Modal */}
      {showPrintModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white p-0 rounded-lg shadow-lg max-w-[800px] w-full max-h-[100vh] overflow-auto relative">
            <button 
              onClick={() => setShowPrintModal(false)}
              className="absolute top-4 right-4 z-10 p-1 rounded-full bg-white hover:bg-gray-200 shadow-md"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <PrintInvoice order={selectedOrder} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
