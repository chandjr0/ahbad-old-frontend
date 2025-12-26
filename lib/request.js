import { hostname } from "@/config";
import axios from "axios";
import { parseCookies } from "nookies";

export default async function request(url, token = null) {
  const cookies = parseCookies();
  const fullUrl = `${hostname}/api/v1/${url}`;

  const config = {
    headers: { Authorization: `${token ? token || "" : cookies?.token || ""}` },
  };

  try {
    console.log("[request] GET", fullUrl);
    const res = await axios.get(fullUrl, config);
    console.log("[request] success", { status: res?.status, url: fullUrl });
    return res;
  } catch (error) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Unknown request error";

    // Handle 304 (Not Modified) responses gracefully - axios handles these automatically
    if (status === 304) {
      console.warn("[request] 304 Not Modified", { url: fullUrl });
      return error.response;
    }

    // Return error response for 400/404 errors so we can handle them properly
    if (status === 400 || status === 404) {
      console.warn("[request] handled error response", {
        url: fullUrl,
        status,
        message,
      });
      return error.response;
    }

    // For network errors or other errors, log and return null
    console.error("[request] network or unexpected error", {
      url: fullUrl,
      status,
      message,
      data: error?.response?.data,
    });
    return null;
  }
}
