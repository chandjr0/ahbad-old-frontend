"use client"

import React, { useEffect, useState } from "react";
import sdkEventsApi from "../sdkEventsApi";
import useFbclid from "../useFbclid";
import { useStatus } from "@/context/contextStatus";
import FacebookPixel from "../FacebookPixel";
import PageView, { getFormattedEventDetails } from "./PageView";

const InitiateCheckout = ({ deliveryOption }) => {
  const fbclid = useFbclid();
  const [fullUrl, setFullUrl] = useState("");
  const { settingsData, cartItems } = useStatus();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return; // Only proceed if fbclid is available

    const fetchConversionApi = async () => {
      try {
        // Construct full URL
        const fullUrl = `${window.location.origin}${window.location.pathname}`;
        setFullUrl(fullUrl); // Set full URL

        // Construct conversion API data
        const conversionApiData = {
          fbClickId: fbclid || "", // Use fbclid from the hook
          fullUrl,
          eventType: "InitiateCheckout",
          shipping: deliveryOption?.amount,
          products: cartItems.map((item) => ({
            sku: item?.sku,
            productId: item?.productId,
            categoryName: item?.category,
            name: item?.name,
            qty: item?.quantity,
            price: item?.price,
            description: item?.name,
            stackAvailable: item?.stock,
          })),
        };

        // Send data to the API
        const response = await sdkEventsApi(conversionApiData);
        const time = getFormattedEventDetails(response?.data?.currentTimestamp);


        // Prepare event data for analytics
        const eventData = {
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

          shipping: deliveryOption?.amount,
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
              .reduce((a, b) => a + b, 0) + deliveryOption?.amount,
        };

        setEventData(eventData); // Set the event data in your state
      } catch (error) {
        console.error("Error fetching conversion API:", error);
      }
    };

    // Proceed to fetch API if fbclid is available and cartItems has items
    if (deliveryOption?.amount) {
      fetchConversionApi();
    }
  }, [fbclid, deliveryOption?.amount]);
  return (
    <div>
      <PageView />

      {settingsData?.allScript?.fbScript?.header && eventData?.eventID && (
        <FacebookPixel
          eventType="InitiateCheckout"
          eventData={eventData}
          pixelId={settingsData?.allScript?.fbScript?.header}
        />
      )}
    </div>
  );
};

export default InitiateCheckout;
