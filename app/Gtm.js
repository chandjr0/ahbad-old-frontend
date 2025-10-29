"use client";
import React, { useEffect } from "react";
import { v4 as uuidv4 } from "uuid"; // Import v4 for UUID generation

const isEmpty = (value) => {
  // Check if value is an empty object or array
  return (
    value &&
    typeof value === "object" &&
    Object.keys(value).length === 0 &&
    value.constructor === Object
  ) || (Array.isArray(value) && value.length === 0);
};

const Gtm = ({ data }) => {
  useEffect(() => {
    if (typeof window !== "undefined" && window?.dataLayer) {
      const eventID = uuidv4(); // Generate a unique ID for eventID

      // Check if `data` is neither an empty object nor an empty array
      if (data !== undefined && !isEmpty(data) && eventID) {
        window.dataLayer = window.dataLayer || []; // Ensure dataLayer exists

        // Push ecommerce null event
        window.dataLayer.push({ ecommerce: null });
        // Push event data with unique eventID
        const eventData = { ...data, eventID };
        window.dataLayer.push(eventData);

      } else {
        console.warn("Data is empty or undefined, or Event ID is missing. DataLayer push skipped.");
      }
    }
  }, [data]); // Dependencies include data

  return <div></div>;
};

export default Gtm;
