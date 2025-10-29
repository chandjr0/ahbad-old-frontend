'use client'
import { parseCookies } from "nookies";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import decryptData from "@/app/api/decrypt";
import wishlistDecrypt from "@/app/api/wishlistDecrypt";
import axios from "axios";
import { hostname } from "@/config";

const ContextStatus = createContext();

const ContextStatusProvider = ContextStatus.Provider;

function StatusProvider({ children }) {

  const cookie = parseCookies();

  let items;

  if (typeof window !== 'undefined') {
    const storedItems = localStorage.getItem('myCartMain');
    if (storedItems) {
      // items = JSON.parse(storedItems);
      items = decryptData()
    }else{
      items = []
    }
  }

  let wishlist;

  if (typeof window !== 'undefined') {
    const storedItems = localStorage.getItem('wishList');
    if (storedItems) {
      // items = JSON.parse(storedItems);
      wishlist = wishlistDecrypt()
    }else{
      wishlist = []
    }
  }



  let settings = {}

  if (typeof window !== 'undefined') {
    const storedItems = localStorage.getItem('settings');
    if (storedItems) {
      settings = storedItems
    }else{
      settings = {}
    }
  }

  // if (cookie?.hasOwnProperty("settings") && cookie.settings !== null && typeof cookie.settings !== 'undefined') {
  //   try {
  //     settings = JSON.parse(cookie.settings);
  //   } catch (error) {
  //     console.error("Error parsing settings:", error);
  //   }
  // }


  const [token, setToken] = useState(cookie?.token ? cookie?.token : "");

  const [cartItems, setCartItems] = useState(items);
  const [allCategories, setAllCategories] = useState([]);
  const [wishlistItems, setWishlistItems] = useState(wishlist);
  const [settingsData, setSettingsData] = useState(settings)
  const [promoCode, setPromoCode] = useState('')
  const [isBuyNow, setIsBuyNow] = useState(false)
  const [buyNowProducts, setBuyNowProducts] = useState([])
  const [sideCategory, setSideCategory] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const [siteView, setSiteView] = useState([]);


  useEffect (()=>{
    fetchLandingPageData();
    fetchCategoryData();
  },[])

  const fetchLandingPageData = async () => {
    const response = await axios.get(`${hostname}/api/v1/setting/admin/site-view`);
    setSiteView(response.data?.data)
  }

  const fetchCategoryData = async () => {
    const response = await axios.get(`${hostname}/api/v1/category/fetch-all`);
    setAllCategories(response.data?.data)
  }

 



  
 const rsleftMenuRef = useRef(null);

  return (
    <ContextStatusProvider
      value={{
        token,
        setToken,
        cartItems,
        wishlistItems,
        setWishlistItems,
        setCartItems,
        setSettingsData,
        settingsData,
        setPromoCode,
        promoCode,
        setBuyNowProducts,
        buyNowProducts,
        setIsBuyNow,
        isBuyNow,
        sideCategory,
        setSideCategory,
        profileMenu,
        setProfileMenu,
        rsleftMenuRef,
        siteView,
        allCategories
      }}
    >
      {children}
    </ContextStatusProvider>
  );
}

function useStatus() {
  const all = useContext(ContextStatus);
  return all;
}

export { StatusProvider, useStatus };

