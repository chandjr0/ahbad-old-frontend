"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [eventData, setEventData] = useState(null);
  const hasFiredRef = useRef(false);
  const lastPathnameRef = useRef(null);

  useEffect(() => {
    // Reset if pathname changed (new page view)
    if (lastPathnameRef.current !== pathname) {
      hasFiredRef.current = false;
      lastPathnameRef.current = pathname;
      setEventData(null);
    }

    // Early exit if already fired for this page view
    if (hasFiredRef.current) {
      return;
    }

    // Early exit if FB pixel ID not configured
    if (!settingsData?.allScript?.fbScript?.header) {
      return;
    }

    // Early exit if fbclid not available
    if (!fbclid) {
      return;
    }

    const fetchConversionApi = async () => {
      try {
        const fullUrl = typeof window !== "undefined" 
          ? `${window.location.origin}${window.location.pathname}`
          : "";
        
        const conversionApiData = {
          fbClickId: fbclid || "",
          fullUrl,
          eventType: "PageView",
        };
        
        const response = await sdkEventsApi(conversionApiData);
        const data = response?.data || {};
        
        if (!data?.currentTimestamp) {
          return;
        }

        const time = getFormattedEventDetails(data.currentTimestamp);

        if (data?.userIpAddress) {
          const eventPayload = {
            page: data?.fullUrl,
            plugin: "StoreX",
            client_ip_address: data?.userIpAddress,
            client_user_agent: data?.userAgent,
            ...(typeof window !== "undefined" && window.address ? window.address : {}),
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
          hasFiredRef.current = true;
        }
      } catch (error) {
        // Silent fail - don't spam console
      }
    };

    fetchConversionApi();
  }, [fbclid, pathname, settingsData?.allScript?.fbScript?.header]);

  if (!settingsData?.allScript?.fbScript?.header || !eventData?.eventID) {
    return null;
  }

  return (
    <FacebookPixel
      eventType="PageView"
      eventData={eventData}
      pixelId={settingsData.allScript.fbScript.header}
    />
  );
};

export default PageView;
