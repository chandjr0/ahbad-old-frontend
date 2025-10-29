"use client";
import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import Barcode from "react-barcode";
import { imageBasePath } from "@/config";
import request from "@/lib/request";
import { useEffect, useState } from "react";

const PrintInvoice = ({ order }) => {
  const [siteSettings, setSiteSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const componentRef = useRef();

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await request("setting/admin/site-view");
        if (res?.data?.success) {
          setSiteSettings(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching site settings:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  if (isLoading || !order) {
    return (
      <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="print-content">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-content,
          .print-content * {
            visibility: visible;
          }
          .print-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
          }
        }
      `}</style>

      <div ref={componentRef} className="w-full max-w-[768px] mx-auto bg-white text-black p-4 md:p-8">
        {/* Header with Logo */}
        <div className="flex justify-center mb-4">
          {siteSettings?.logoImg && (
            <img
              src={`${imageBasePath}/${siteSettings.logoImg}`}
              alt="Logo"
              className="h-12 md:h-16 object-contain"
            />
          )}
        </div>
        
        <div className="text-center mb-2">
          <p className="text-xs md:text-sm">
            Shop ID: <strong>{order.serialId.split('_')[0] || "45760"}</strong>
          </p>
        </div>

        {/* Customer and Order Info */}
        <div className="flex flex-col md:flex-row justify-between mb-6 md:mb-8 gap-4">
          <div className="flex-1">
            <p className="mb-1 text-xs md:text-sm">
              <span className="font-semibold">Name:</span> {order.deliveryAddress?.name}
            </p>
            <p className="mb-1 text-xs md:text-sm">
              <span className="font-semibold">Phone:</span> {order.deliveryAddress?.phone}
            </p>
            <p className="mb-1 text-xs md:text-sm break-words">
              <span className="font-semibold">Address:</span>{" "}
              {order.deliveryAddress?.address}, {order.deliveryAddress?.city?.city_name}, {order.deliveryAddress?.zone?.zone_name}
            </p>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <p className="text-xs md:text-sm mb-1">
              <span className="font-semibold">Hotline:</span> {siteSettings?.phone || "01644311977"}
            </p>

            <div className="mb-1 max-w-full overflow-hidden flex md:justify-center w-full md:w-auto">
              <Barcode
                value={order.serialId}
                height={30}
                displayValue={false}
                width={1.5}
                margin={0}
              />
            </div>

            <p className="text-xs md:text-sm md:text-center w-full md:w-auto font-semibold tracking-wider">
              {order.serialId}
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-white">
                <th className="text-left border border-gray-300 p-2 text-xs md:text-sm">PRODUCT</th>
                <th className="text-center border border-gray-300 p-2 w-16 md:w-20 text-xs md:text-sm">Qty</th>
                <th className="text-center border border-gray-300 p-2 w-20 md:w-32 text-xs md:text-sm">Price</th>
              </tr>
            </thead>
            <tbody>
              {order.products?.map((item, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-2 text-xs md:text-sm">
                    <div className="flex items-center gap-2">
                      {item.product?.galleryImage && item.product.galleryImage[0] && (
                        <div className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                          <img
                            src={`${imageBasePath}/${item.product.galleryImage[0]}`}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <span className="text-xs">{item.product?.name}{item.isVariant && ` (${item.variationName})`}</span>
                    </div>
                  </td>
                  <td className="border border-gray-300 p-2 text-center text-xs md:text-sm">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-300 p-2 text-center text-xs md:text-sm">
                    ৳ {item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-40 md:w-60">
            <div className="flex justify-between mb-1 text-xs md:text-sm">
              <span>Sub Total:</span>
              <span>৳ {order.customerCharge?.totalProductPrice}</span>
            </div>
            
            <div className="flex justify-between mb-1 text-xs md:text-sm">
              <span>Delivery Charge:</span>
              <span>৳ {order.customerCharge?.deliveryCharge}</span>
            </div>
            
            {order.customerCharge?.discountPrice > 0 && (
              <div className="flex justify-between mb-1 text-xs md:text-sm">
                <span>Discount:</span>
                <span>৳ {order.customerCharge?.discountPrice}</span>
              </div>
            )}
            
            <div className="flex justify-between mb-1 text-xs md:text-sm font-semibold">
              <span>Collectable Amount:</span>
              <span>৳ {order.customerCharge?.remainingTkPay}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-4 border-green-900 mt-auto">
          {/* Empty footer space as in the example */}
        </div>
      </div>
    </div>
  );
};

export default PrintInvoice; 