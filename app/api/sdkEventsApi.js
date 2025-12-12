// components/SdkEventsApi.js
import { apiKey, hostname } from '@/config';
import axios from 'axios';

const sdkEventsApi = async (conversionApi) => {
  // Validate if fbClickId is present in conversionApi
  if (!conversionApi?.fbClickId) {
    return null; // Skip the API call
  }

  const apiUrl = `${hostname}/api/v1/fb/admin/sdk-events`;

  try {
    const response = await axios.post(apiUrl, conversionApi);
    return response.data; // Return data if you need to use it later
  } catch (error) {
    // Silent fail - don't spam console
    return null;
  }
};

export default sdkEventsApi;
