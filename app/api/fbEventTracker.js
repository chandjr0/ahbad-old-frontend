import postRequest from "@/lib/postRequest";
import axios from "axios";

async function trackFacebookEvent(fbObj) {
  let tokens = JSON.parse(localStorage.getItem("settings"));

  try {
    // let res = await axios.post(
    //   `https://graph.facebook.com/v18.0/${tokens?.allScript?.fbScript?.header}/events`,
    //   {
    //     data: [fbObj],
    //     access_token: tokens?.allScript?.fbScript?.accessToken,
    //   }
    // );
    let res = await postRequest(`fb/admin/sdk-events`, fbObj);
    
    if (res?.success) {
    }
  } catch (error) {
    console.log("error", error);
  }
}

export default trackFacebookEvent;

