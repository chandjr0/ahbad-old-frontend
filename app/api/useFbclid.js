// hooks/useFbclid.js
"use client"

import { useState, useEffect } from "react";
import { generateFbclid } from "./generateFbclid";

const useFbclid = () => {
  const [fbclid, setFbclid] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      let fbClickId = urlParams.get("fbclid") || localStorage.getItem("fbclid");
      const fbclidTimestamp = localStorage.getItem("fbclidTimestamp");
      const now = Date.now();

      // Check if fbclid exists and if 30 minutes have passed since it was set
      if (fbClickId && fbclidTimestamp && now - fbclidTimestamp > 30 * 60 * 1000) {
        // 30 minutes have passed, so clear fbclid
        localStorage.removeItem("fbclid");
        localStorage.removeItem("fbclidTimestamp");
        fbClickId = null; // Reset to generate a new one
      }

      // Priority: If fbclid exists in URL, use that instead of the one in localStorage
      if (urlParams.has("fbclid")) {
        fbClickId = urlParams.get("fbclid");
        // Set fbclid and timestamp in localStorage
        localStorage.setItem("fbclid", fbClickId);
        localStorage.setItem("fbclidTimestamp", now);
      }

      // If fbclid is neither in the URL nor in localStorage, generate a new one
      if (!fbClickId) {
        fbClickId = generateFbclid();
        localStorage.setItem("fbclid", fbClickId); // Save fbclid to localStorage
        localStorage.setItem("fbclidTimestamp", now); // Save the current timestamp
      }

      // If fbclid is generated and not in the URL, don't update the URL to avoid showing it
      if (!urlParams.has("fbclid")) {
        // No need to update the URL if fbclid is not already there
        // Just set the fbclid in the state
        setFbclid(fbClickId);
      } else {
        // If fbclid exists in the URL, we should show it in the param
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("fbclid", fbClickId);
        window.history.replaceState({}, "", newUrl.toString());
        setFbclid(fbClickId); // Set fbclid in the state
      }
    }
  }, []);


  return fbclid; // Return fbclid to use in any component
};

export default useFbclid;
