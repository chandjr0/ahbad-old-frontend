"use client";

import React, { useEffect, useState } from "react";
import sdkEventsApi from "../sdkEventsApi";
import useFbclid from "../useFbclid";
import FacebookPixel from "../FacebookPixel";
import { useStatus } from "@/context/contextStatus";

export function getFormattedEventDetails(timestamp) {
  const today = new Date();
  const eventDay = today.toLocaleString("en-US", { weekday: "long" });
  const eventMonth = today.toLocaleString("en-US", { month: "long" });
  const eventYear = today.getFullYear();

  const date = new Date(timestamp * 1000);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedTime = `${hours % 12 || 12}:${
    minutes < 10 ? "0" : ""
  }${minutes} ${ampm}`;

  return { eventDay, eventMonth, eventYear, formattedTime };
}

const PageView = () => {
  const fbclid = useFbclid();
  const { settingsData } = useStatus();
  const [eventData, setEventData] = useState([]);

  useEffect(() => {

    const fetchConversionApi = async () => {
      try {
        const fullUrl = `${window.location.origin}${window.location.pathname}`;
        const conversionApiData = {
          fbClickId: fbclid || "", // Use fbclid or send an empty string
          fullUrl,
          eventType: "PageView",
        };
        const response = await sdkEventsApi(conversionApiData);
        const data = response?.data || {};
        const time = getFormattedEventDetails(data?.currentTimestamp);


        if (data?.userIpAddress) {
          const eventPayload = {
            page: data?.fullUrl,
            plugin: "StoreX",
            client_ip_address: data?.userIpAddress,
            client_user_agent: data?.userAgent,
            ...window.address,
            eventID: data?.eventId,
            event: "PageView",
            event_time: time?.formattedTime,
            event_day: time?.eventDay,
            event_month: time?.eventMonth,
            event_year: time?.eventYear,
            fbp: data?.fbp,
            ...(data?.externalId && { external_id: data?.externalId }),
          };

          setEventData(eventPayload);
        }
      } catch (error) {
        console.error("Error fetching conversion API:", error);
      }
    };

    if (fbclid) {
      fetchConversionApi(); // Fetch API only if fbclid is defined (including empty string)
    }
  }, [fbclid]);

  return (
    <div>
      {settingsData?.allScript?.fbScript?.header && eventData?.eventID && (
        <FacebookPixel
          eventType="PageView"
          eventData={eventData}
          pixelId={settingsData?.allScript?.fbScript?.header}
        />
      )}
    </div>
  );
};

export default PageView;
