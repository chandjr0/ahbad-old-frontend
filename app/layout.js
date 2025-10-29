import { Fondamento, Noto_Sans} from "next/font/google";
import "react-loading-skeleton/dist/skeleton.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Header from "./components/header";
import "react-tabs/style/react-tabs.css";
import { Providers } from "./redux/provider";
import { StatusProvider } from "../context/contextStatus";
import ResLeftMenu from "./components/Layout/RsLeftMenu/RsLeftMenu";
import BottomNavbar from "./components/Layout/BottomNavbar/BottomNavbar";
import SideProfileMenu from "./components/Layout/SideProfileMenu/SideProfileMenu";
import MetaPixel from "./components/MetaPixel";
import GoogleTagManager from "./components/googleTagComponent";
import request from "@/lib/request";
import { baseUrl, imageBasePath } from "@/config";
import NavbarMain from "./components/update/navbar/NavbarMain";
import Footer from "./components/update/Footer/Footer";
import Script from "next/script";
import ScrollRestorationWrapper from "./components/ScrollRestorationWrapper";

const notoSans = Noto_Sans({
  weight: [ "400",],
  style: ["normal"],
  subsets: ["latin"],
});

export async function getData() {
  try {
    let res = await request(`setting/admin/site-view`);
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("err in get settings", error);
  }
}

// export const metadata = {
//   metadataBase: new URL(baseUrl),
// };

export default async function RootLayout({ children }) {
  const siteData = await getData();

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/remixicon@4.3.0/fonts/remixicon.css"
        />
      </head>
      <Script
        id="gtm"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
            var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
            j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
            f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-XXXXXXX'); // Replace GTM-XXXXXXX with your GTM ID
          `,
        }}
      />

      <body className={notoSans.className}>
        <StatusProvider>
          <Providers>
            <MetaPixel />
            <GoogleTagManager />
            {/* <Header /> */}
            <NavbarMain />
            <ScrollRestorationWrapper />
            {children}
            <Footer />
            <ResLeftMenu />
            {/* <BottomNavbar /> */}
            <SideProfileMenu />
            <ToastContainer
              position="top-right"
              autoClose="1500"
              hideProgressBar={false}
              closeOnClick={true}
              pauseOnHover
              draggable={true}
            />
          </Providers>
        </StatusProvider>
      </body>
    </html>
  );
}
