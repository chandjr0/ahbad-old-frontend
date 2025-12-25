"use client";
import { useStatus } from "@/context/contextStatus";
import { useRouter } from "next/navigation";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import postRequest from "../../lib/postRequest";
import request from "../../lib/request";
import AddressSection from "../components/Checkout/AddressSection";
import CartoverviewSection from "../components/Checkout/CartoverviewSection";
import BreadCrumbs from "../components/Common/Breadcumb";
import findUserIpAddress from "../api/ip";
import generateUniqueId from "../api/uniqueIds";
import trackFacebookEvent from "../api/fbEventTracker";
import { sha256 } from "js-sha256";
import generateFbc from "../api/fb_c";
import generateFbp from "../api/fb_p";
import decryptData from "../api/decrypt";
import { getData } from "../layout";
import Gtm from "../Gtm";
import InitiateCheckout from "../api/conversion/InitiateCheckout";
import BuyToCart from "../api/conversion/BuyToCart";
import { baseUrl, imageBasePath } from "@/config";
import { decode } from 'html-entities';
import striptags from 'striptags';
import { v4 as uuidv4 } from 'uuid';
import { jwtDecode } from "jwt-decode";

const Checkout = () => {
  const bdMobilePattern = /^(\+)?(88)?01[3-9]\d{8}$/;
  const { settingsData, setCartItems, promoCode, token, setToken } = useStatus();
  const router = useRouter();
  const [deliveryOption, setDeliveryOption] = useState({});
  const [paymentOption, setPaymentOption] = useState("cash");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("select");
  const [thana, setThana] = useState("select");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [subTotal, setSubTotal] = useState(0);
  const [isError, setIsError] = useState(false);
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [isPromo, setIsPromo] = useState(false);
  const cookie = parseCookies();
  const [loading, setLoading] = useState(false);
  const [districtList, setDistrictList] = useState([]);
  const [thanaList, setThanaList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [selectedArea, setSelectedArea] = useState("");
  const [isDeliveryPromo, setIsDeliveryPromo] = useState(false);
  const [paymentInfo, setPaymentInfo] = useState({});
  const [payPhone, setPayPhone] = useState("");
  const [transaction, setTransaction] = useState("");
  const [siteData, setSiteData] = useState();
  const [gtmPurchase, setGtmPurchase] = useState({});
  const [otpNumber, setOtpNumber] = useState("");
  const [otpUserType, setOtpUserType] = useState("");
  const [buyToCart, setBuyToCart] = useState({});
  const modalRef = useRef(null);
  const [visitorId, setVisitorId] = useState('');

  const siteDataGet = async () => {
    const data = await getData();
    setSiteData(data);
  };
  useEffect(() => {
    siteDataGet();
  }, []);

  let cartItems;

  if (typeof window !== "undefined") {
    const storedItems = localStorage.getItem("myCartMain");
    if (storedItems) {
      cartItems = decryptData();
    }
  }

  const user = cookie?.hasOwnProperty("userInfo")
    ? JSON.parse(cookie?.userInfo)
    : {};

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";

  let protocol = "";
  let domain = "";

  if (origin.startsWith("https://")) {
    protocol = "https://";
    domain = origin.slice(8);
  } else if (origin.startsWith("http://")) {
    protocol = "http://";
    domain = origin.slice(7);
  }

  useEffect(() => {
    // Check if visitorId exists in localStorage
    const storedVisitorId = localStorage.getItem('visitorId');
    
    if (storedVisitorId) {
      // If visitorId exists, use it
      setVisitorId(storedVisitorId);
    } else {
      // If no visitorId exists, generate a new one
      const newVisitorId = uuidv4();
      localStorage.setItem('visitorId', newVisitorId);
      setVisitorId(newVisitorId);
    }
  }, []);

  const createOrder = async (otp) => {
    let finalProducts = [];
    let fbProducts = [];
    let combos = [];
    let city;
    let zone;
    setLoading(true);


    if (district !== "select") {
      city = districtList.find((e) => e.city_id == district);
    } else {
      toast.error("সিটি সিলেক্ট করুন।");
      setLoading(false);
      setIsError(true);
      return;
    }

    if (thana !== "select") {
      zone = thanaList.find((e) => e.zone_id == thana);
    } else {
      toast.error("থানা সিলেক্ট করুন।");
      setLoading(false);
      setIsError(true);
      return;
    }

    if (cartItems?.length > 0) {
      cartItems?.map((item, index) => {
        if (!item?.isCombo) {
          finalProducts?.push({
            productId: item?.productId,
            isVariant: item?.isVariant,
            quantity: item?.quantity,
            price: item?.price,
            variationId: item?.variation == null ? "" : item?.variation?._id,
            variationName:
              item?.variation == null
                ? ""
                : item?.variation?.attributeOpts?.map((i) => i?.name).join("-"),
          });
        }
        if (item?.isCombo) {
          combos?.push({
            comboId: item?.comboId,
            quantity: item?.quantity,
            price: item?.price,
            products: item?.comboProducts,
          });
        }

        fbProducts?.push({
          name: item?.name,
          category: item?.category,
          sku: item?.sku,
          slug: item?.slug,
          stock: item?.stock,
          productId: item?.productId,
          isVariant: item?.isVariant,
          quantity: item?.quantity,
          price: item?.price,
          variation: item?.variation,
        });
      });
    } else {
      toast.error("কোন পণ্য ঝুড়িতে নাই।");
      setLoading(false);
      setIsError(true);
      return;
    }

    if (address?.length < 10) {
      toast.error("ঠিকানা ১০ অক্ষরের বেশি হতে হবে ।");
      setLoading(false);
      setIsError(true);
      return;
    }

    const data = {
      customerId: user?.id || "",
      products: finalProducts,
      combos: combos,
      promo: promoCode,
      customerNote: note,
      deliveryType: deliveryOption?.type,
      payment: {
        paymentType: "cash",
        amount: 0,
        details: "",
        documentImg: "",
      },
      onlinePaymentReq: paymentOption !== "cash" ? true : false,
      host: domain,
      customerCharge: {
        totalProductPrice: Number(subTotal) || 0,
        discountPrice: isDeliveryPromo ? 0 : (Number(promoDiscount) || 0),
        deliveryCharge: isDeliveryPromo ? 0 : (Number(deliveryOption?.amount) || 0),
        totalPayTk: 0,
      },
      deliveryAddress: {
        name: name,
        phone: phone,
        cityId: city?._id || city?.city_id, // Support both MongoDB _id and city_id
        zoneId: zone?._id || zone?.zone_id, // Support both MongoDB _id and zone_id
        address: address,
      },
    };

    if (paymentOption !== "cash" && paymentOption !== "amar_pay") {
      data.payment["paymentType"] = paymentInfo?.name + " " + `(${payPhone})`;
      data.payment["details"] = transaction;
      const deliveryAmount = Number(deliveryOption?.amount) || 0;
      const promoDiscountAmount = Number(promoDiscount) || 0;
      const subTotalAmount = Number(subTotal) || 0;
      const calculatedTotal = isDeliveryPromo
        ? subTotalAmount
        : subTotalAmount + deliveryAmount - promoDiscountAmount;
      
      data.payment["amount"] = isNaN(calculatedTotal) ? 0 : calculatedTotal;
      data.customerCharge["totalPayTk"] = isNaN(calculatedTotal) ? 0 : calculatedTotal;
    }

    const fbData = {
      customerId: user?.id || "",
      products: fbProducts,
      promo: promoCode,
      customerNote: note,
      deliveryType: deliveryOption?.type,
      onlinePaymentReq: paymentOption !== "cash" ? true : false,
      host: domain,
      customerCharge: {
        totalProductPrice: subTotal,
        discountPrice: isDeliveryPromo ? 0 : promoDiscount,
        deliveryCharge: isDeliveryPromo ? 0 : deliveryOption?.amount,
      },
      deliveryAddress: {
        name: name,
        phone: phone,
        address: address,
        city: city.city_name,
        zone: zone.zone_name,
      },
    };

    // Save customer information to localStorage
    const customerInfo = {
      name: name,
      phone: phone,
      email: user?.email || '',
      address: address,
      district: city?.city_name || '',
      policeStation: zone?.zone_name || ''
    };
    
    try {
      localStorage.setItem('customerInfo', JSON.stringify(customerInfo));
      
      // Verify the data was saved correctly
      const savedInfo = localStorage.getItem('customerInfo');
      
      // Ensure proper time for localStorage to update
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error('Error saving customer info to localStorage:', error);
    }

    // Generate the checkout payload for GTM
    const generateCheckoutPayload = (cartItems, response) => {
      const items = cartItems.map((item) => {
        const price = item?.isVariant
          ? item?.variation?.flashPrice || item?.variation?.sellingPrice
          : item?.price;

          const shortDescription = item?.shortDescription
          ? decode(striptags(item.shortDescription)).length > 100
            ? `${decode(striptags(item.shortDescription)).slice(0, 100)}...`
            : decode(striptags(item.shortDescription))
          : item?.description
          ? decode(striptags(item.description)).length > 100
            ? `${decode(striptags(item.description)).slice(0, 100)}...`
            : decode(striptags(item.description))
          : "";

          const image = item?.isVariant? item?.variation?.images?.[0] : item?.image?.[0];

        return {
          item_id: item?.sku,
          item_name: item?.name,
          // discount: item?.variation?.regularPrice || 0,
          discount: (item?.variation?.regularPrice-item?.variation?.sellingPrice) || 0,
          index: cartItems.indexOf(item),
          item_brand: item?.brand?.name || "",
          item_category: item?.category || "",
          price: item?.variation?.regularPrice,
          quantity: item?.quantity || 1,
          condition: "new",
          image: `${imageBasePath}/${image}`,
          description: shortDescription,
          url: `${baseUrl}/product/${item?.slug}`,
          brand: item?.brand?.name || "",
          availability: "in stock",
        };
      });

      const productInfo = {
        event: "purchase",
        eventID: null,
        plugin: "StoreX",
        currency: "BDT", // Updated to correct currency code
        value: response?.customerCharge?.totalBill,
        transaction_id: response?.serialId,
        shipping: response?.customerCharge?.deliveryCharge,
        coupon: "",
        customer: {
          id: 0, // Placeholder, should be replaced with actual customer ID if available
          billing: {
            first_name: name,
            last_name: "",
            company: "",
            address_1: address,
            address_2: "",
            city: city.city_name,
            zone: zone.zone_name,
            postcode: "",
            country: "BD",
            email: "",
            phone: phone,
          },
        },
        items: items,
      };

      return productInfo;
    };

    // Proceed with order creation if all conditions are met
    if (
      name &&
      bdMobilePattern.test(phone) &&
      district &&
      thana !== "select" &&
      address
    ) {
      try {
        if (otp == "otp") {
          if (paymentOption == "amar_pay") {
            console.log("📦 Order data being sent:", {
              productsCount: data.products?.length,
              combosCount: data.combos?.length,
              cityId: data.deliveryAddress?.cityId,
              zoneId: data.deliveryAddress?.zoneId,
              totalProductPrice: data.customerCharge?.totalProductPrice,
              customerId: data.customerId,
            });
            let res = await postRequest(`admin-order/customer/create`, data);
            
            // Handle 409 Conflict and other errors with detailed logging
            if (res?.success === false) {
              console.error("❌ Order creation failed:", {
                message: res?.message,
                status: res?.status,
                data: res?.data,
              });
              toast.error(res?.message || "Order creation failed. Please check your cart and try again.");
              setLoading(false);
              setIsError(true);
              return;
            }
            
            if (res?.success) {
              // Set token in cookie if present in response
              if (res?.data?.token) {
                setCookie(null, "token", res?.data?.token, {
                  maxAge: 24 * 60 * 60,
                  path: "/",
                });
                setToken(res?.data?.token);
                
                // Decrypt token and set user info in cookie
                try {
                  const decodedToken = jwtDecode(res?.data?.token);
                  setCookie(
                    null,
                    "userInfo",
                    JSON.stringify({ 
                      id: decodedToken?._id, 
                      phone: decodedToken?.userName,
                      name: name 
                    }),
                    {
                      maxAge: 24 * 60 * 60,
                      path: "/",
                    }
                  );
                } catch (error) {
                  console.error("Error decoding token:", error);
                }
              }
              
              const value = {
                eventType: "Purchase",
                fbClickId: "",
                fullUrl: `${window.location.origin}/thank-you`,
                user: {
                  name: name,
                  phone: phone,
                  address: address,
                  district: "",
                  upazila: "",
                },
                products: cartItems?.map((item) => ({
                  sku: item?.sku,
                  productId: item?.productId,
                  categoryName: item?.category,
                  name: item?.name,
                  qty: item?.quantity,
                  price: item?.price,
                  description: item?.name,
                  stackAvailable: item?.stock,
                })),
                orderId: res?.data?.serialId,
                totalPrice: res?.data?.customerCharge?.totalBill,
              };
              localStorage.setItem("eventData", JSON.stringify(value));
              window.location.href = res?.paymentUrl;
              toast.success(res?.message);
              setCartItems([]);
              localStorage.removeItem("myCartMain");
              setLoading(false);
            } else {
              toast.warning(res?.message || "Order creation failed");
              setLoading(false);
              setIsError(true);
            }
          } else {
            console.log("📦 Order data being sent:", {
              productsCount: data.products?.length,
              combosCount: data.combos?.length,
              cityId: data.deliveryAddress?.cityId,
              zoneId: data.deliveryAddress?.zoneId,
              totalProductPrice: data.customerCharge?.totalProductPrice,
            });
            let res = await postRequest(`admin-order/customer/create`, data);
            
            // Handle 409 Conflict and other errors
            if (res?.success === false) {
              console.error("❌ Order creation failed:", res?.message);
              toast.error(res?.message || "Order creation failed. Please check your cart and try again.");
              setLoading(false);
              setIsError(true);
              return;
            }
            
            if (res?.success) {
              // Set token in cookie if present in response
              if (res?.data?.token) {
                setCookie(null, "token", res?.data?.token, {
                  maxAge: 24 * 60 * 60,
                  path: "/",
                });
                setToken(res?.data?.token);
                
                // Decrypt token and set user info in cookie
                try {
                  const decodedToken = jwtDecode(res?.data?.token);
                  setCookie(
                    null,
                    "userInfo",
                    JSON.stringify({ 
                      id: decodedToken?._id, 
                      phone: decodedToken?.userName,
                      name: name 
                    }),
                    {
                      maxAge: 24 * 60 * 60,
                      path: "/",
                    }
                  );
                } catch (error) {
                  console.error("Error decoding token:", error);
                }
              }
              
              const value = {
                eventType: "Purchase",
                fbClickId: "",
                shipping: deliveryOption?.amount,
                fullUrl: `${window.location.origin}/thank-you`,
                user: {
                  name: name,
                  phone: phone,
                  address: address,
                  district: "",
                  upazila: "",
                },
                products: cartItems?.map((item) => ({
                  sku: item?.sku,
                  productId: item?.productId,
                  categoryName: item?.category,
                  name: item?.name,
                  qty: item?.quantity,
                  price: item?.price,
                  description: item?.name,
                  stackAvailable: item?.stock,
                })),
                orderId: res?.data?.serialId,
                totalPrice: res?.data?.customerCharge?.totalBill,
              };
              localStorage.setItem("eventData", JSON.stringify(value));
              const productInfo = generateCheckoutPayload(cartItems, res?.data);
              setGtmPurchase(productInfo);
              toast.success(res?.message);
              setCartItems([]);
              localStorage.removeItem("myCartMain");
              router.push(
                `/thank-you/${res?.data?.serialId}/${res?.data?.customerCharge?.totalBill}/${name}`
              );
              setLoading(false);
              
            } else {
              toast.warning(res?.message);
              setLoading(false);
            }
          }
        } else {
          if (token) {
            if (paymentOption == "amar_pay") {
              let res = await postRequest(`admin-order/customer/create`, data);
              if (res?.success) {
                // Set token in cookie if present in response
                if (res?.data?.token) {
                  setCookie(null, "token", res?.data?.token, {
                    maxAge: 24 * 60 * 60,
                    path: "/",
                  });
                  setToken(res?.data?.token);
                }
                
                // Decrypt token and set user info in cookie
                try {
                  const decodedToken = jwtDecode(res?.data?.token);
                  setCookie(
                    null,
                    "userInfo",
                    JSON.stringify({ 
                      id: decodedToken?._id, 
                      phone: decodedToken?.userName,
                      name: name 
                    }),
                    {
                      maxAge: 24 * 60 * 60,
                      path: "/",
                    }
                  );
                } catch (error) {
                  console.error("Error decoding token:", error);
                }
                
                const value = {
                  eventType: "Purchase",
                  fbClickId: "",
                  fullUrl: `${window.location.origin}/thank-you`,
                  user: {
                    name: name,
                    phone: phone,
                    address: address,
                    district: "",
                    upazila: "",
                  },
                  products: cartItems?.map((item) => ({
                    sku: item?.sku,
                    productId: item?.productId,
                    categoryName: item?.category,
                    name: item?.name,
                    qty: item?.quantity,
                    price: item?.price,
                    description: item?.name,
                    stackAvailable: item?.stock,
                  })),
                  orderId: res?.data?.serialId,
                  totalPrice: res?.data?.customerCharge?.totalBill,
                };
                localStorage.setItem("eventData", JSON.stringify(value));
                window.location.href = res?.paymentUrl;
                toast.success(res?.message);
                setCartItems([]);
                localStorage.removeItem("myCartMain");
                setLoading(false);
              } else {
                toast.warning(res?.message);
                setLoading(false);
              }
            } else {
              let res = await postRequest(`admin-order/customer/create`, data);
              if (res?.success) {
                // Set token in cookie if present in response
                if (res?.data?.token) {
                  setCookie(null, "token", res?.data?.token, {
                    maxAge: 24 * 60 * 60,
                    path: "/",
                  });
                  setToken(res?.data?.token);
                }
                
                // Decrypt token and set user info in cookie
                try {
                  const decodedToken = jwtDecode(res?.data?.token);
                  console.log("decodedToken", decodedToken)
                  setCookie(
                    null,
                    "userInfo",
                    JSON.stringify({ 
                      id: decodedToken?._id, 
                      phone: decodedToken?.userName,
                      name: name 
                    }),
                    {
                      maxAge: 24 * 60 * 60,
                      path: "/",
                    }
                  );
                } catch (error) {
                  console.error("Error decoding token:", error);
                }
                
                const value = {
                  eventType: "Purchase",
                  fbClickId: "",
                  shipping: deliveryOption?.amount,
                  fullUrl: `${window.location.origin}/thank-you`,
                  user: {
                    name: name,
                    phone: phone,
                    address: address,
                    district: "",
                    upazila: "",
                  },
                  products: cartItems?.map((item) => ({
                    sku: item?.sku,
                    productId: item?.productId,
                    categoryName: item?.category,
                    name: item?.name,
                    qty: item?.quantity,
                    price: item?.price,
                    description: item?.name,
                    stackAvailable: item?.stock,
                  })),
                  orderId: res?.data?.serialId,
                  totalPrice: res?.data?.customerCharge?.totalBill,
                };
                localStorage.setItem("eventData", JSON.stringify(value));
                const productInfo = generateCheckoutPayload(
                  cartItems,
                  res?.data
                );
                setGtmPurchase(productInfo);
                toast.success(res?.message);
                setCartItems([]);
                localStorage.removeItem("myCartMain");
                router.push(
                  `/thank-you/${res?.data?.serialId}/${res?.data?.customerCharge?.totalBill}/${name}`
                );
                setLoading(false);
              } else {
                toast.warning(res?.message);
                setLoading(false);
              }
            }
          } else {
            let res = await postRequest(`admin-order/customer/otp-send`, {
              phone: phone,
            });
            if (res?.success) {
              toast.success(res?.message);
              setOtpNumber(res?.data);
              if (modalRef.current) {
                modalRef.current.showModal();
              }
            }
          }
        }
      } catch (error) {
        console.log("error in order create", error);
        setLoading(false);
      }
    } else {
      toast.error(
        bdMobilePattern.test(phone)
          ? "আবশ্যক ইনপুট গুলো পূরন করতে হবে"
          : "আপনার মোবাইল নাম্বারটি সঠিক নয়।"
      );

      setIsError(true);
      setLoading(false);
    }
  };

  const applyPromo = async (promoCode) => {
    let finalProducts = [];
    let combos = [];

    if (cartItems?.length > 0) {
      cartItems?.map((item, index) => {
        if (!item?.isCombo) {
          finalProducts?.push({
            productId: item?.productId,
            isVariant: item?.isVariant,
            quantity: item?.quantity,
            price: item?.price,
            variationId: item?.variation == null ? "" : item?.variation?._id,
            variationName:
              item?.variation == null
                ? ""
                : item?.variation?.attributeOpts?.map((i) => i?.name).join("-"),
          });
        }
        if (item?.isCombo) {
          combos?.push({
            comboId: item?.comboId,
            quantity: item?.quantity,
            price: item?.price,
            products: item?.comboProducts,
          });
        }
      });
    } else {
      toast.error("কোন পণ্য ঝুড়িতে নাই।");
      setLoading(false);
      setIsError(true);
      return;
    }

    const obj = {
      promo: promoCode,
      phone: phone,
      products: finalProducts,
      combos: combos,
    };
    try {
      let res = await postRequest(`promo/verify-promo`, obj);
      if (res?.success) {
        toast.success(res?.message);
        if (res?.data?.promoType == "free_delivery") {
          setIsDeliveryPromo(true);
        }
        setIsPromo(true);
        setPromoDiscount(res?.data?.discount);
        // setPromoCode('')
      } else {
        toast.warning(res?.message);
      }
    } catch (error) {
      console.log("error in promo apply", error);
    }
  };

  const removePromo = async () => {
    setIsPromo(false);
    setPromoDiscount(0);
    setIsDeliveryPromo(false);
  };

  useEffect(() => {
    const getDistrict = async () => {
      try {
        let res = await request(`courier-service/pathao/get-areas`);
        if (res?.data?.success && res?.data?.data) {
          const districts = Array.isArray(res.data.data) ? res.data.data : [];
          setDistrictList(districts);
          if (districts.length === 0) {
            console.warn("No districts found. Please sync Pathao data via admin panel.");
          }
        } else {
          setDistrictList([]);
          console.error("Failed to fetch districts:", res?.data?.message);
        }
      } catch (error) {
        console.error("Error in getDistrict:", error);
        setDistrictList([]);
      }
    };
    getDistrict();
  }, []);

  const getDistrictWiseThana = async (id) => {
    console.log("🔵 getDistrictWiseThana called with ID:", id, typeof id);
    setThana("select");
    setThanaList([]); // Reset thana list
    if (!id || id === "select") {
      console.log("⚠️ Invalid ID, returning early");
      return;
    }
    try {
      // Ensure id is a number (city_id is stored as number in database)
      const cityId = typeof id === 'string' ? parseInt(id, 10) : id;
      if (isNaN(cityId)) {
        console.error("❌ Invalid district ID:", id);
        setThanaList([]);
        return;
      }
      
      console.log(`📡 Fetching thanas for cityId: ${cityId}`);
      const url = `courier-service/pathao/get-zones/${cityId}`;
      console.log(`📡 API URL: ${url}`);
      
      let res = await request(url);
      
      // request() returns axios response object, so res.data is the API response
      if (!res) {
        console.error("❌ No response from API - request returned null");
        setThanaList([]);
        return;
      }
      
      if (!res.data) {
        console.error("❌ No data in response:", res);
        setThanaList([]);
        return;
      }
      
      console.log("✅ Thana API response:", res.data);
      console.log("✅ Success:", res.data?.success);
      console.log("✅ Data:", res.data?.data);
      console.log("✅ Data type:", Array.isArray(res.data?.data) ? "array" : typeof res.data?.data);
      console.log("✅ Data length:", Array.isArray(res.data?.data) ? res.data.data.length : "N/A");
      
      if (res.data?.success && res.data?.data) {
        const thanas = Array.isArray(res.data.data) ? res.data.data : [];
        console.log(`✅ Found ${thanas.length} thanas for district ${cityId}`);
        if (thanas.length > 0) {
          console.log("✅ Thana names:", thanas.map(t => t.zone_name).join(", "));
        }
        setThanaList(thanas);
        if (thanas.length === 0) {
          console.warn(`⚠️ No thanas found for district ID: ${cityId}`);
        }
      } else {
        setThanaList([]);
        console.error("❌ Failed to fetch thanas. Success:", res.data?.success);
        console.error("❌ Data:", res.data?.data);
        console.error("❌ Message:", res.data?.message);
      }
    } catch (error) {
      console.error("❌ Exception in getDistrictWiseThana:", error);
      setThanaList([]);
    }
  };

  useEffect(() => {
    // const districtInfo = districtList?.find((e) => e._id == district);
    if (district == 1) {
      setDeliveryOption({
        type: "inside",
        amount: Number(settingsData?.deliveryCharge?.inside?.amount) || 0,
      });
    } else if (district !== "select") {
      setDeliveryOption({
        type: "outside",
        amount: Number(settingsData?.deliveryCharge?.outside?.amount) || 0,
      });
    } else {
      // Default to outside with 0 amount if no district selected
      setDeliveryOption({
        type: "outside",
        amount: 0,
      });
    }
  }, [district, settingsData]);

  const breadCumbs = [{ name: "Home", url: "/" }, { name: `checkout` }];

  // otp submit
  const otpSubmit = async (e) => {
    e.preventDefault();

    // Prepare data to send to the API
    const requestData = {
      phone,
      otpCode: otpUserType,
    };

    


    try {
      let res = await postRequest(
        `admin-order/customer/otp-verify`,
        requestData
      );

      if (res?.success) {
        createOrder("otp");
      } else {
        toast.error(res?.message);
        setOtpUserType("");
      }

      // if (response.ok) {
      //   console.log('OTP verification successful:', data);
      //   modalRef.current.close();
      // } else {
      //   console.log('OTP verification failed:', data);
      // }
    } catch (error) {
      console.error("Error during OTP verification:", error);
    }
  };

  // but to cart

  useEffect(() => {
    const storedEventData = localStorage.getItem("buyNowToCart");
    setBuyToCart(JSON.parse(storedEventData));

  },[]);

  useEffect(() => {
    const processIncompleteOrder = async () => {
      if (phone.length !== 11 || !bdMobilePattern.test(phone)) {
        return;
      }

      if (!cartItems?.length) {
        return;
      }

      let finalProducts = [];
      let combos = [];

      cartItems.forEach((item) => {
        if (!item?.isCombo) {
          finalProducts.push({
            productId: item?.productId,
            isVariant: item?.isVariant,
            quantity: item?.quantity,
            price: item?.price,
            variationId: item?.variation?._id || "",
            variationName: item?.variation?.attributeOpts?.map((i) => i?.name).join("-") || "",
          });
        } else {
          combos.push({
            comboId: item?.comboId,
            quantity: item?.quantity,
            price: item?.price,
            products: item?.comboProducts,
          });
        }
      });

      const data = {
        visitorId: visitorId,
        customerId: user?.id || "",
        products: finalProducts,
        combos,
        promo: promoCode,
        customerNote: note,
        deliveryType: deliveryOption?.type,
        payment: {
          paymentType: "cash",
          amount: 0,
          details: "",
          documentImg: "",
        },
        onlinePaymentReq: paymentOption !== "cash",
        host: domain,
        customerCharge: {
          totalProductPrice: subTotal,
          discountPrice: isDeliveryPromo ? 0 : promoDiscount,
          deliveryCharge: isDeliveryPromo ? 0 : deliveryOption?.amount,
          totalPayTk: 0,
        },
        deliveryAddress: {
          name,
          phone,
          cityId: null,
          address: null,
        },
      };

      try {
        const res = await postRequest(`admin-order/customer/create-incomplete`, data);
        // We don't need to handle the response since this is just tracking
      } catch (error) {
        console.log("Error creating incomplete order:", error);
      }
    };

    if (phone.length === 11) {
      processIncompleteOrder();
    }
  }, [phone]);

  return (
    <>
      {/* Google Tag Manager  */}
      {gtmPurchase && <Gtm data={gtmPurchase} />}

        {/* conversion api  */}
        <InitiateCheckout deliveryOption={deliveryOption} />
      {buyToCart && <BuyToCart data={buyToCart} />}


      <div className=" bg-gray-100 text-black pb-12 min-h-[600px]">
        <div className="bg-gray-200 py-4 px-8 xls:px-4 xls:py-2 xms:px-4 xms:py-2 xs:px-2 xs:py-2">
          <BreadCrumbs breadCumbs={breadCumbs} />
        </div>

        {/* <div className="border-b border-gray-200 mt-6">
          <div className="base-container ">
            <ul className="flex justify-between items-center py-3">
              <li className="capitalize font-semibold relative">
                <p className="relative">Checkout</p>
                <div className="absolute top-4 left-0 w-full h-full bg-transparent border-b-4 border-black pointer-events-none"></div>
              </li>

              <li className="capitalize font-semibold relative">
                <p className="relative">Completed</p>
              </li>
            </ul>
          </div>
        </div> */}

        <div className="base-container border-2 border-gray-200 rounded-lg mt-6">
          <div className="relative mt-4">
            <p className="text-center text-lg xls:text-base xms:text-base xs:text-base font-semibold text-black ">
              অর্ডার করতে সঠিক তথ্য দিয়ে নিচের ফরম পূরন করুন{" "}
            </p>
            <div className="absolute top-2  w-[50%] transform translate-x-1/2  h-full bg-transparent border-b-4 border-dashed  border-secondary pointer-events-none"></div>
          </div>
          <div className="grid grid-cols-12 gap-5 mt-10 xls:mt-5 xms:mt-4 xs:mt-4">
            <div className=" col-span-12 lg:col-span-6">
              <AddressSection
                setAddress={setAddress}
                setName={setName}
                setDistrict={setDistrict}
                setThana={setThana}
                setPhone={setPhone}
                setNote={setNote}
                note={note}
                name={name}
                district={district}
                thana={thana}
                address={address}
                phone={phone}
                setIsError={setIsError}
                isError={isError}
                districtList={districtList}
                getDistrictWiseThana={getDistrictWiseThana}
                thanaList={thanaList}
                // getThanaWiseArea={getThanaWiseArea}
                areaList={areaList}
                setSelectedArea={setSelectedArea}
                selectedArea={selectedArea}
              />
            </div>

            <div className=" col-span-12 lg:col-span-6">
              <CartoverviewSection
                setDeliveryOption={setDeliveryOption}
                deliveryOption={deliveryOption}
                setPaymentOption={setPaymentOption}
                paymentOption={paymentOption}
                info={cartItems}
                deliveryData={settingsData?.deliveryCharge}
                settingsData={settingsData}
                setSubTotal={setSubTotal}
                subTotal={subTotal}
                createOrder={createOrder}
                applyPromo={applyPromo}
                isPromo={isPromo}
                promoDiscount={promoDiscount}
                loading={loading}
                removePromo={removePromo}
                isDeliveryPromo={isDeliveryPromo}
                setPayPhone={setPayPhone}
                setTransaction={setTransaction}
                setPaymentInfo={setPaymentInfo}
                payPhone={payPhone}
                transaction={transaction}
                paymentInfo={paymentInfo}
              />
            </div>
          </div>
        </div>
      </div>

      <dialog ref={modalRef} id="otp_modal" className="modal">
        <div className="modal-box w-11/12 max-w-md p-6">
          <h3 className="font-bold text-2xl text-center mb-4">
            Verify Your OTP
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Please enter the One-Time Password (OTP) sent to your registered
            mobile number.
          </p>

          {/* OTP Input Form */}
          <form className="flex flex-col items-center" onSubmit={otpSubmit}>
            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              className="input input-bordered w-full max-w-xs text-center text-lg tracking-widest mb-4"
              value={otpUserType}
              onChange={(e) => setOtpUserType(e.target.value)}
              required
            />

            <div className="flex justify-between gap-4 w-full">
              {/* Close Button */}
              <button
                type="button"
                className="btn bg-black text-white w-full max-w-[45%]"
                onClick={() => modalRef.current.close()}
              >
                Close
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn bg-primary text-white w-full max-w-[45%]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default Checkout;
