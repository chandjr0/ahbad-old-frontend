import { hostname } from "@/config";
import axios from "axios";
import { parseCookies } from "nookies";


export default async function patchRequest(url, data, token = null) {
  const cookies = parseCookies();
  const config = {
    headers: { Authorization: `${token ? token || "" : cookies?.token || ""}` },
  };

  try {
    const res = await axios.patch(`${hostname}/api/v1/${url}`, data, config);
    if (res.hasOwnProperty("data")) {
      return res?.data;
    } else {
    }
  } catch (error) {
    return error?.response?.data;
  }
}
