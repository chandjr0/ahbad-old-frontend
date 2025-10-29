import React, { useEffect, useState } from "react";
import useFbclid from "../useFbclid";
import { useStatus } from "@/context/contextStatus";
import sdkEventsApi from "../sdkEventsApi";
import FacebookPixel from "../FacebookPixel";
import { getFormattedEventDetails } from "./PageView";

const Purchase = ({ data, shipping }) => {
  const fbclid = useFbclid();
  const [fullUrl, setFullUrl] = useState("");
  const { settingsData, cartItems } = useStatus();
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
            ...data, // Use all the existing data as is
            fbClickId: fbclid || "", // Update only the fbClickId field
          };
          

        // Send data to the API
        const response = await sdkEventsApi(conversionApiData);
        const time = getFormattedEventDetails(response?.data?.currentTimestamp);

        



        if(response?.success){

        const conversionData = {
          content_id: response?.data?.products?.[0]?.sku,
          content_ids: response?.data?.products?.map((p) => p.sku) || [],
          content_type: "product",
          contents: response?.data?.products,
          num_items: response?.data?.products?.length,
          product_weight: "kg", // Assuming product weight (adjust if necessary)
          currency: response?.data?.currency,
          price: response?.data?.products
            .map((p) => p.price * p.qty)
            .reduce((a, b) => a + b, 0),

          shipping: shipping || 0,
          plugin: "StoreX",
          event_time: time?.formattedTime,
            event_day: time?.eventDay,
            event_month: time?.eventMonth,
            event_year: time?.eventYear,
          client_ip_address: response?.data?.userIpAddress,
          client_user_agent: response?.data?.userAgent,
          ...window.address, // Assuming window.address is available
          eventID: response?.data?.eventId,
          fbp: response?.data?.fbp,
          ...(response?.data?.externalId && {
            external_id: response?.data?.externalId,
          }),
          // Add the value field which is the sum of price and shipping
          value:
            response?.data?.products
              .map((p) => p.price * p.qty)
              .reduce((a, b) => a + b, 0) + shipping || 0,
        };

        setEventData(conversionData); 
        }
      } catch (error) {
        console.error("Error fetching conversion API:", error);
      }
    };

    // Proceed to fetch API if fbclid is available and cartItems has items
    if (fbclid) {
      fetchConversionApi();
    }
  }, [fbclid]);



  return <div>
    {settingsData?.allScript?.fbScript?.header && eventData?.eventID && (
        <FacebookPixel
          eventType="Purchase"
          eventData={eventData}
          pixelId={settingsData?.allScript?.fbScript?.header}
        />
      )}
  </div>;
};

export default Purchase;
