import { parseCookies } from "nookies";

export default async function generateFbc() {
  const cookie = parseCookies();
  if (
    cookie?.hasOwnProperty("fbClickId") &&
    cookie.fbClickId !== null &&
    typeof cookie.fbClickId !== "undefined"
  ) {
    const current_timestamp = Math.floor(new Date() / 1000);
    const fbc_id = `fb.1.${current_timestamp}.${JSON.parse(cookie.fbClickId)}`;
    return fbc_id;
  } else {
    return;
  }
}
