import { hostname } from "@/config";
import axios from "axios";
import { parseCookies } from "nookies";

export default async function postRequest(url, data, token = null) {
  const cookies = parseCookies();

  const config = {
    headers: {
      Authorization: token? `${token}`: cookies?.token? `${cookies?.token}`:'',
      
      

    },
  };

  try {
    const res = await axios.post(`${hostname}/api/v1/${url}`, data, config);
    if (res.hasOwnProperty("data")) {
      return res?.data;
    } else {
      return null;
    }
  } catch (error) {
    // Return error response data with status code for better error handling
    if (error?.response?.data) {
      return {
        ...error.response.data,
        status: error.response.status,
      };
    }
    return {
      success: false,
      message: error?.message || "Network error occurred",
      status: error?.response?.status || 500,
    };
  }
}
