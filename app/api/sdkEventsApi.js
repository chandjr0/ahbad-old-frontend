// components/SdkEventsApi.js
import { apiKey, hostname } from '@/config';
import axios from 'axios';

const sdkEventsApi = async (conversionApi) => {
  // Validate if fbClickId is present in conversionApi
  if (!conversionApi?.fbClickId) {
    return; // Skip the API call or handle it as needed
  }

  // const apiUrl = `${hostname}/api/v1/fb/reseller/sdk-events?api_key=${apiKey}`;
  // http://localhost:8074/api/v1
  const apiUrl = `${hostname}/api/v1/fb/admin/sdk-events`;

  try {
    const response = await axios.post(apiUrl, conversionApi);
    return response.data; // Return data if you need to use it later
  } catch (error) {
    console.error("API call error:", error);
    throw error;
  }
};

export default sdkEventsApi;
