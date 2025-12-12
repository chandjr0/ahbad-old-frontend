"use client";

import { useEffect, useRef } from "react";

const FacebookPixel = ({ eventType, eventData, pixelId }) => {
  const trackedEventIdRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined" && pixelId) {
      // Check if Pixel is already initialized
      if (!window.fbq) {
        (function (f, b, e, v, n, t, s) {
          if (f.fbq) return;
          n = f.fbq = function () {
            n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
          };
          if (!f._fbq) f._fbq = n;
          n.push = n;
          n.loaded = !0;
          n.version = "2.0";
          n.queue = [];
          t = b.createElement(e);
          t.async = !0;
          t.src = v;
          s = b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t, s);
        })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

        fbq("init", pixelId);
      }
    }
  }, [pixelId]);

  useEffect(() => {
    if (typeof window !== "undefined" && pixelId && eventData?.eventID) {
      // Only track if this eventID hasn't been tracked yet
      if (trackedEventIdRef.current !== eventData.eventID) {
        fbq("track", eventType, eventData);
        trackedEventIdRef.current = eventData.eventID;
      }
    }
  }, [eventType, eventData?.eventID, pixelId]);

  return null;
};

export default FacebookPixel;
