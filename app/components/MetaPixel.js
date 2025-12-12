"use client";

import { useEffect } from "react";
import { useStatus } from "@/context/contextStatus";

export default function MetaPixel() {
  const { settingsData } = useStatus();

  useEffect(() => {
    const pixelId = settingsData?.allScript?.fbScript?.header;

    // Only initialize if we have a valid pixel ID and haven't already loaded
    if (!pixelId || typeof window === "undefined" || window.fbq) {
      return;
    }

    // FB Pixel base code
    (function(f,b,e,v,n,t,s) {
      if(f.fbq) return;
      n = f.fbq = function() {
        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
      };
      if(!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = !0;
      n.version = '2.0';
      n.queue = [];
      t = b.createElement(e);
      t.async = !0;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

    // Initialize with pixel ID
    window.fbq('init', pixelId);
    window.fbq('track', 'PageView');
  }, [settingsData]);

  // Client-only component renders nothing visible
  return null;
}
