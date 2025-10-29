import React, { useEffect, useState } from "react";
import useFbclid from "../useFbclid";
import { useStatus } from "@/context/contextStatus";
import FacebookPixel from "../FacebookPixel";
import sdkEventsApi from "../sdkEventsApi";
import { getFormattedEventDetails } from "./PageView";

const BuyToCart = ({ data }) => {

  const fbclid = useFbclid();
  const { settingsData } = useStatus();
  const [fullUrl, setFullUrl] = useState("");
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return; // Only proceed if fbclid is available

    const fetchConversionApi = async () => {
      try {
        // Construct full URL
        const fullUrl = `${window.location.origin}${window.location.pathname}`;
        setFullUrl(fullUrl); // Set full URL

        // Construct conversion API data
        const conversionApiData = {
          fbClickId: fbclid || "", // Use fbclid here
          fullUrl,
          eventType: "AddToCart",
          products: [
            {
              sku: data?.sku,
              productId: data?.sku,
              categoryName: data?.categoryName,
              name: data?.name,
              qty: data?.qty,
              price: data?.price,
              description: data?.description,
              stackAvailable: data?.stackAvailable,
            },
          ],
        };

        // Send data to the API
        const response = await sdkEventsApi(conversionApiData);
        const time = getFormattedEventDetails(response?.data?.currentTimestamp);



        if (response?.success) {
          const eventData = {
            id: response?.data?.products?.[0]?.sku,
            content_id: response?.data?.products?.[0]?.sku,
            content_ids:
              response?.data?.products?.map((product) => product.sku) || [],
            content_name: response?.data?.products?.[0]?.name,
            content_category: response?.data?.products?.[0]?.categoryName,
            content_type: "product",
            contents: response?.data?.products?.[0],
            currency: "BDT",
            event_time: time?.formattedTime,
            event_day: time?.eventDay,
            event_month: time?.eventMonth,
            event_year: time?.eventYear,
            value: (response?.data?.products?.[0]?.price * response?.data?.products?.[0]?.qty),
            description: response?.data?.products?.[0]?.description,
            quantity: response?.data?.products?.[0]?.qty,
            availability:
              response?.data?.products?.[0]?.stackAvailable > 0
                ? "in stock"
                : "out of stock",
            condition: "new",
            // price: response?.data?.products?.[0]?.price,
            // sale_price: response?.data?.products?.[0]?.price,
            status: "active",
            client_ip_address: response?.data?.userIpAddress,
            client_user_agent: response?.data?.userAgent,
            ...window.address,
            plugin: "Storex",
            // ...(response?.data?.products?.[0]?.stackAvailable && {
            //   stock: response?.data?.products?.[0]?.stackAvailable,
            // }),
            eventID: response?.data?.eventId,
            event: "AddToCart",
            fbp: response?.data?.fbp,
            ...(response?.data?.externalId && {
              external_id: response?.data?.externalId,
            }),
          };


          setEventData(eventData);
        }
      } catch (error) {
        console.error("Error fetching conversion API:", error);
      }
    };

    // Proceed to fetch API if fbclid is available and cartItems has items
    if (fbclid) {
      fetchConversionApi();
      localStorage.removeItem("buyNowToCart");

    }
  }, [fbclid]);

  return (
    <div>
      {settingsData?.allScript?.fbScript?.header && eventData?.eventID && (
        <FacebookPixel
          eventType="AddToCart"
          eventData={eventData}
          pixelId={settingsData?.allScript?.fbScript?.header}
        />
      )}
    </div>
  );
};

export default BuyToCart;
