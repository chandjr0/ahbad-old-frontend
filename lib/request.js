import { hostname } from "@/config";
import axios from "axios";
import { parseCookies } from "nookies";


export default async function request(url, token = null) {
  const cookies = parseCookies();


  const config = {
    headers: { Authorization: `${token ? token || "" : cookies?.token || ""}` }
  };

  try {
    const res = await axios.get(`${hostname}/api/v1/${url}`, config);
    return res;
  } catch (error) {
    // Handle 304 (Not Modified) responses gracefully - axios handles these automatically
    if (error?.response?.status === 304) {
      return error.response;
    }
    return null;
  }
}
