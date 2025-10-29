"use client";
import React, { useEffect, useState } from "react";
import useFbclid from "../useFbclid";
import { useStatus } from "@/context/contextStatus";
import FacebookPixel from "../FacebookPixel";
import sdkEventsApi from "../sdkEventsApi";
import PageView, { getFormattedEventDetails } from "./PageView";

const ViewContent = ({ info, selectedVariation }) => {
  const fbclid = useFbclid();
  const { settingsData } = useStatus();
  const [eventData, setEventData] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const fetchConversionApi = async () => {
      try {
        // Use fbclid from the hook or URL
        const fullUrl = `${window.location.origin}${window.location.pathname}`;

        // Set initial data from info
        const price = info?.isVariant
          ? info?.variations?.[0]?.sellingPrice
          : info?.nonVariation?.sellingPrice;
        const stackAvailable = info?.isVariant
          ? info?.variations?.[0]?.stock
          : info?.nonVariation?.stock;

        // Override with selectedVariation data if available
        const finalPrice = selectedVariation?.sellingPrice || price;
        const finalStockAvailable = selectedVariation?.stock || stackAvailable;

        // Construct conversion API data
        const conversionApiData = {
          fbClickId: fbclid || "", // Use fbclid here
          fullUrl,
          eventType: "ViewContent",
          products: [
            {
              sku: info?.sku,
              productId: info?._id,
              categoryName: info?.categories?.[0]?.name || "",
              name: info?.name,
              qty: 1,
              price: finalPrice,
              description: info?.description,
              stackAvailable: finalStockAvailable,
            },
          ],
        };

        // Uncomment the line below to send data to the API
        const response = await sdkEventsApi(conversionApiData);

        const time = getFormattedEventDetails(response?.data?.currentTimestamp);

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
          value: response?.data?.products?.[0]?.price,
          description: response?.data?.products?.[0]?.description,
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
          event: "ViewContent",
          fbp: response?.data?.fbp,
          ...(response?.data?.externalId && {
            external_id: response?.data?.externalId,
          }),
        };

        setEventData(eventData);

        // event("ViewContent", eventData);
      } catch (error) {
        console.error("Error fetching conversion API:", error);
      }
    };

    fetchConversionApi();
  }, [info, selectedVariation, fbclid]);

  return (
    <div>
      <PageView />
      {settingsData?.allScript?.fbScript?.header && eventData?.eventID && (
        <FacebookPixel
          eventType="ViewContent"
          eventData={eventData}
          pixelId={settingsData?.allScript?.fbScript?.header}
        />
      )}
    </div>
  );
};

export default ViewContent;
