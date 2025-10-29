"use client";
import React, { useEffect, useState, useRef } from "react";
import { FaFacebook, FaLinkedin, FaTwitter, FaWhatsapp } from "react-icons/fa";
import { IoMdMail } from "react-icons/io";
import { IoCallOutline } from "react-icons/io5";
import { useStatus } from "@/context/contextStatus";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import Link from "next/link";
import CountdownTimerDetails from "../ProductSection/CountdownTimerDetails";
import findUserIpAddress from "../../api/ip";
import generateUniqueId from "../../api/uniqueIds";
import trackFacebookEvent from "../../api/fbEventTracker";
import request from "@/lib/request";
import { sha256 } from "js-sha256";
import generateFbc from "@/app/api/fb_c";
import generateFbp from "@/app/api/fb_p";
import { parseCookies } from "nookies";
import encryptData from "@/app/api/encrypt";
import postRequest from "@/lib/postRequest";

const DetailsSection = ({ info }) => {
  const cookie = parseCookies();
  const router = useRouter();

  const { cartItems, setCartItems, settingsData } = useStatus();
  const [selected, setSelected] = useState(false);
  const [count, setCount] = useState(1);
  const [showingVariantList, setShowingVariantList] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [isStock, setIsStock] = useState(true);
  const [totalStock, setTotalStock] = useState(0);
  const [diffTimes, setDiffTimes] = useState();
  const [currentDate, setCurrentDate] = useState(Date.now());
  const [productInfo, setProductInfo] = useState({});

  // gtm tag
  useEffect(() => {
    if (info?.isVariant) {
      const e_commerce = {
        currency: "BDT",
        items: [
          {
            item_id: info?.sku,
            item_name: info?.name,
            item_brand: info?.brand?.name,
            item_category: info?.categories?.length ? info?.categories[0] : "",
            item_variant: info?.isVariant ? info?.variations : "",
            price: info?.sellingPrice,
          },
        ],
      };
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        event: "product_view",
        e_commerce,
      });
      fbAddToCartEvent("ViewContent", e_commerce);
    } else {
      const e_commerce = {
        currency: "BDT",
        items: [
          {
            item_id: info?.sku,
            item_name: info?.name,
            item_brand: info?.brand?.name,
            item_category: info?.categories?.length ? info?.categories[0] : "",
            price: info?.isFlashDeal
              ? info?.nonVariation?.flashPrice
              : info?.nonVariation?.sellingPrice,
          },
        ],
      };
      window.dataLayer = window.dataLayer || [];
      dataLayer.push({
        event: "product_view",
        e_commerce,
      });
      fbAddToCartEvent("ViewContent", e_commerce);
    }
  }, [1]);

  useEffect(() => {
    let res = updateVariationFlag(info);
    setProductInfo(res);
  }, [info]);

  function updateVariationFlag(info) {
    info.isVariant = info.comboProduct.some((product) => product.isVariant);
    return info;
  }

  useEffect(() => {
    if (showingVariantList?.length > 0) {
      let isNotValid = showingVariantList.find(
        (val) => val.selectedValue === ""
      );
      if (!isNotValid) {
        let selectedAttr = showingVariantList?.map((val) => val.selectedValue);
        setSelected(false);
        const checkArrays = info?.comboProduct?.forEach((item) => {
          item?.variations.map((item) => {
            if (item.attributeOpts) {
              const attributeNames = item.attributeOpts.map(
                (attr) => attr.name
              );
              if (
                selectedAttr.sort().join("-") ===
                attributeNames.sort().join("-")
              ) {
                setSelectedVariation(item);
                if (item?.stock <= 0) {
                  setIsStock(true);
                  setTotalStock(item?.stock);
                } else {
                  setIsStock(false);
                  setTotalStock(item?.stock);
                }
              }
            }
          });
        });
      } else {
      }
    }
  }, [showingVariantList, info?.variations]);

  useEffect(() => {
    if (info?.isVariant) {
      setIsStock(info?.totalStock <= 0 ? true : false);
      setTotalStock(info?.totalStock);
    } else {
      setIsStock(info?.nonVariation?.stock <= 0 ? true : false);
      setTotalStock(info?.nonVariation?.stock);
    }
  }, [info]);

  // quantity increment func
  const increment = async (index) => {
    // const obj = {
    //   variationId: selectedVariation?._id || '',
    //   productId: info?._id,
    // };

    // try {
    //   let res = await postRequest(
    //     `product/admin-customer/check-product-stock`,
    //     obj
    //   );
    //   if (res) {
    //     if (res?.data?.stock >= count + 1) {
          setCount(count + 1);
          toast.success("Success! Quantity Increased");
    //     } else {
    //       toast.warning("Warning! No More Stock Left");
    //     }
    //   }
    // } catch (error) {
    //   console.log("error in stock check", error);
    // }
  };

  // quantity decrement func
  const decrement = async (index) => {
    setCount(count > 1 ? count - 1 : 1);
    // toast.success("Success! Quantity Decreased");
  };

  const callDataLayer = async (eventName, e_commerce) => {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: eventName,
      e_commerce,
    });
  };

  const fbAddToCartEvent = async (eventname, e_commerce) => {
    const userIp = await findUserIpAddress();
    const eventId = await generateUniqueId();
    const fbc_id = await generateFbc();
    const fbp_id = await generateFbp();

    const value = {
      event_name: eventname,
      event_id: eventId,
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      event_source_url: window.location.href,
      user_data: {
        client_user_agent: navigator.userAgent,
        client_ip_address: userIp || "0.0.0.0",
        country: sha256("Bangladesh"),
        fbc: cookie._fbc || fbc_id,
        fbp: cookie._fbp || fbp_id,
      },
      value: e_commerce?.items[0]?.price,
      currency: "BDT",
      content_type: "product",
      content_name: e_commerce?.items[0]?.item_name,
    };

    trackFacebookEvent(value);
  };

  // buy now func
 
  // buy now func
  const buyNow = async () => {
    if (isStock) {
      toast.warning("Stock Out !");
      return;
    }

    for (const product of productInfo.comboProduct) {
      if (product.variations.length > 0 && !product.selectedVariation) {
        toast.warning(
          `Please select a variation for the product: ${product.name}`
        );
        return;
      }
    }

    let isExit = false;

    if (cartItems?.length) {
      for (let i = 0; i < cartItems.length; i++) {
        let obj = cartItems[i];
        if (obj?.comboId === productInfo?._id) {
          if (productInfo.isVariant) {
            let flag = checkVariationIdsMatchWithCombo(
              productInfo?.comboProduct,
              obj?.comboProducts
            );
            if (!flag) {
              isExit = true;
              break;
            }
          }
        }
      }
    }

    setCount(1);

    if (!isExit) {
      let modifiedPro = [];
      productInfo.comboProduct.forEach((item, index) => {
        if (item?.isVariant) {
          item.variations.forEach((variation) => {
            if (variation?.selected) {
              modifiedPro.push({
                productId: item.productId,
                isVariant: item.isVariant,
                variationId: variation._id,
                variationName: variation?.attributeOpts
                  ?.map((i) => i?.name)
                  .join(" - "),
              });
            }
          });
        } else {
          modifiedPro.push({
            productId: item.productId,
            isVariant: item.isVariant,
            variationId: "",
            variationName: "",
          });
        }
      });

      let item = {
        comboId: productInfo?._id,
        isCombo: true,
        name: productInfo?.name,
        image: productInfo?.galleryImage,
        price: productInfo?.sellingPrice,
        comboProducts: modifiedPro,
        sku: productInfo?.sku,
        isVariant: productInfo?.isVariant,
        quantity: count,
      };

      const e_commerce = {
        currency: "BDT",
        items: [
          {
            item_id: info?.sku,
            item_name: info?.name,
            item_brand: info?.brand?.name || "",
            price: info?.sellingPrice,
            quantity: count,
          },
        ],
      };

      setCartItems((cartItems) => [...cartItems, item]);

      encryptData([...cartItems, item]);

      callDataLayer("add_to_cart", e_commerce);
      fbAddToCartEvent("AddToCart", e_commerce);
      toast.success("Success! Item Added to Cart");
      router.push("/checkout");
      selectVariation("");
    } else {
      router.push("/checkout");
    }
  };

  // add to cart function
  const addToCart = async () => {
    for (const product of productInfo.comboProduct) {
      if (product.variations.length > 0 && !product.selectedVariation) {
        toast.warning(
          `Please select a variation for the product: ${product.name}`
        );
        return;
      }
    }

    let isExit = false;

    if (cartItems?.length) {
      for (let i = 0; i < cartItems.length; i++) {
        let obj = cartItems[i];
        if (obj?.comboId === productInfo?._id) {
          if (productInfo.isVariant) {
            let flag = checkVariationIdsMatchWithCombo(
              productInfo?.comboProduct,
              obj?.comboProducts
            );
            if(!flag){
              isExit=true
              break;
            }
          }
        }
      }
    }

    setCount(1);

    if (!isExit) {
      let modifiedPro = [];
      productInfo.comboProduct.forEach((item, index) => {
        if (item?.isVariant) {
          item.variations.forEach((variation) => {
            if (variation?.selected) {
              modifiedPro.push({
                productId: item.productId,
                isVariant: item.isVariant,
                variationId: variation._id,
                variationName: variation?.attributeOpts
                  ?.map((i) => i?.name)
                  .join(" - "),
              });
            }
          });
        } else {
          modifiedPro.push({
            productId: item.productId,
            isVariant: item.isVariant,
            variationId: "",
            variationName: "",
          });
        }
      });

      let item = {
        comboId: productInfo?._id,
        isCombo:true,
        name: productInfo?.name,
        image: productInfo?.galleryImage,
        price: productInfo?.sellingPrice,
        comboProducts: modifiedPro,
        sku: productInfo?.sku,
        isVariant: productInfo?.isVariant,
        quantity: count,
      };

      const e_commerce = {
        currency: "BDT",
        items: [
          {
            item_id: info?.sku,
            item_name: info?.name,
            item_brand: info?.brand?.name || "",
            price: info?.sellingPrice,
            quantity: count,
          },
        ],
      };

      setCartItems((cartItems) => [...cartItems, item]);

      encryptData([...cartItems, item]);

      callDataLayer("add_to_cart", e_commerce);
      fbAddToCartEvent("AddToCart", e_commerce);
      toast.success("Success! Item Added to Cart");
      selectVariation("");
    } else {
      toast.warning("This Variation is already added!");
    }
  };

  function checkVariationIdsMatchWithCombo(productInfo, obj) {
    if (productInfo.length !== obj.length) {
      return false;
    }
    let res = findSelectedVariationIDs(productInfo);
  
    for (let i = 0; i < obj.length; i++) {
      let item = obj[i];
      if (item?.isVariant) {
        let result = res.some((e) => e == item?.variationId);
        if (!result) {
          return true;
        }
      }
    }

    return false;
  }

  function findSelectedVariationIDs(productInfo) {
    let selectedVariationIDs = [];
    for (let product of productInfo) {
      for (let variation of product.variations) {
        if (variation.selected) {
          selectedVariationIDs.push(variation._id);
        }
      }
    }
    return selectedVariationIDs;
  }

  useEffect(() => {
    if (info?.isFlashDeal) {
      const intervalID = setInterval(() => {
        setCurrentDate(Date.now());
      }, 1000);

      return () => {
        clearInterval(intervalID);
      };
    }
  }, []);

  useEffect(() => {
    if (info?.isFlashDeal) {
      if (currentDate <= new Date(settingsData?.flashData?.endTime).getTime()) {
        if (settingsData?.flashData) {
          let endTime = new Date(settingsData?.flashData?.endTime).getTime();

          let diffTime = endTime - currentDate;

          setDiffTimes(diffTime);
        }
      } else if (
        currentDate > new Date(settingsData?.flashData?.endTime).getTime()
      ) {
        const checkFlashDeal = async () => {
          const res = await request(`flashdeal/check-flashdeal`);
          if (res?.success) {
            window.location.reload();
          }
        };
        checkFlashDeal();
      }
    }
  }, [settingsData?.flashData, currentDate]);

  const shareProduct = (info) => {
    const productUrl = `https://believerssign.com/product/${info.slug}`;
    const shareText = `price: ${
      info?.isFlashDeal
        ? info?.isVariant
          ? info?.variations[0]?.flashPrice
          : info?.nonVariation?.flashPrice
        : info?.isVariant
        ? info?.variations[0]?.sellingPrice
        : info?.nonVariation?.sellingPrice
    } ${productUrl} `;
    const url = `https://wa.me/+88${
      settingsData?.socialLinks?.whatsapp
    }?text=${encodeURIComponent(shareText)}`;
    window.open(url, "_blank");
  };

  const [showSecondDiv, setShowSecondDiv] = useState(false);
  const firstDivRef = useRef(null);

  useEffect(() => {
    const toggleSecondDiv = () => {
      if (!firstDivRef.current) return;

      const firstDivRect = firstDivRef.current.getBoundingClientRect();

      if (firstDivRect.bottom <= 50) {
        setShowSecondDiv(true);
      } else {
        setShowSecondDiv(false);
      }
    };

    window.addEventListener("scroll", toggleSecondDiv);

    return () => {
      window.removeEventListener("scroll", toggleSecondDiv);
    };
  }, []);

  const selectVariation = async (id) => {
    let res = updateSelectedVariation(productInfo, id);
    setProductInfo(res);
    // console.log("..............res", res);
  };

  function updateSelectedVariation(info, id) {
    const getIndex = findProductIndexByVariationId(info, id);

    let isVariationSelected = false;
    if (getIndex > -1) {
      info.comboProduct[getIndex].variations.forEach((variation) => {
        if (variation._id === id) {
          variation.selected = true;
          isVariationSelected = true;
        } else {
          variation.selected = false;
        }
      });
      info.comboProduct[getIndex].selectedVariation = isVariationSelected;
    }

    return info;
  }

  function findProductIndexByVariationId(productInfo, variationId) {
    for (let i = 0; i < productInfo.comboProduct.length; i++) {
      const product = productInfo.comboProduct[i];
      for (const variation of product.variations) {
        if (variation._id === variationId) {
          return i;
        }
      }
    }
    return -1; // Return -1 if no matching variationId is found
  }

  return (
    <div className="md:border border-gray-200 border-none p-4 ">
      {info?.isFlashDeal == true && (
        <div>
          <div className="background py-1 xls:py-0 xms:py-0 xs:py-0">
            <div className="flex justify-center">
              <CountdownTimerDetails countdown={diffTimes} />
            </div>
          </div>
          <div></div>
        </div>
      )}
      <p className="md:text-2xl sm:text-xl text-lg font-bold tracking-wide pt-3 xls:pt-2 xms:pt-2 xs:pt-1 capitalize">
        {info?.name}
      </p>

      <div className="pt-3 pb-4 flex justify-between items-center border-b border-gray-300">
        <p>
          <span className="uppercase font-bold">sku:</span>
          <span className="uppercase">{info?.sku}</span>
        </p>

        <div className="flex space-x-3 items-center">
          <div className="flex justify-center items-center bg-gray-200 h-8 w-8 rounded-full">
            <FaFacebook size={20} />
          </div>
          <div className="flex justify-center items-center bg-gray-200 h-8 w-8 rounded-full">
            <FaTwitter size={20} />
          </div>
          <div className="flex justify-center items-center bg-gray-200 h-8 w-8 rounded-full">
            <FaLinkedin size={20} />
          </div>
          <div className="flex justify-center items-center bg-gray-200 h-8 w-8 rounded-full">
            <IoMdMail size={20} />
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center space-x-2">
        <div>
          <h2 className="font-semibold ">
            <span className="line-through text-sm text-black">
              ৳ {info?.regularPrice * count}
            </span>

            <span className="text-red-600 text-2xl">
              ৳ {info?.sellingPrice * count}
            </span>
          </h2>
        </div>
      </div>

      <p className="mt-3">
        <span className="font-semibold">Brand :</span>
        <span className="pl-2">{info?.brand?.name}</span>
      </p>
      <p className="mt-3">
        <span className="font-semibold">Status :</span>
        {isStock ? (
          <span className="pl-2 text-red-500">Stock Out</span>
        ) : (
          <span className="pl-2 text-green-500">In Stock</span>
        )}
      </p>
      <div>
        {productInfo?.comboProduct?.map((item, index) => (
          <>
            {item?.isVariant ? (
              <div key={index} className="mt-3">
                <div>{item?.name}</div>
                <select
                  
                  onChange={(e) => {
                    selectVariation(e.target.value);
                  }}
                  className="bg-gray-50 h-[40px] mt-2 border border-gray-300 text-black text-sm rounded-lg  block w-full p-2.5 appearance-none focus:border-secondary outline-none cursor-pointer"
                >
                  <option disabled selected>
                    Select{" "}
                    <span>
                      {item?.variations[0]?.attributeOpts
                        ?.map((i) => i?.attributeName)
                        .join(" - ")}
                    </span>
                  </option>
                  {item?.variations?.map((it, ind) => (
                    <option key={ind} value={it._id}>
                      {it?.attributeOpts?.map((i) => i?.name).join(" - ")}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </>
        ))}
      </div>

      <div
        id="firstDiv"
        ref={firstDivRef}
        className=" p-1 bg-white  hidden xls:block xms:block xs:block"
      >
        <div className="md:py-3 py-2 border-b border-gray-300 flex justify-left">
          <div className="flex  items-center space-x-4">
            <p className="font-semibold">Quantity :</p>
            <div className="flex items-center border border-gray-300 rounded-sm">
              <button
                onClick={() => decrement()}
                disabled={isStock}
                className="md:p-4 p-2 border-r border-gray-300"
              >
                <svg
                  className="h-3 w-3 fill-current text-gray-400 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M5 11V13H19V11H5Z"></path>
                </svg>
              </button>
              <div>
                <input
                  type="text"
                  className="w-[40px] xs:w-[30px] xms:w-[30px] xls:w-[30px]  pl-3 outline-none"
                  value={count}
                  readOnly
                />
              </div>

              <button
                onClick={() => increment()}
                disabled={isStock}
                className="p-4 xs:p-2 xms:p-2 xls:p-2  border-l border-gray-300"
              >
                <svg
                  className="h-3 w-3 fill-current text-gray-400 "
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 lg:w-2/3 w-full mt-2">
          <div className="w-full">
            <button
              onClick={() => addToCart()}
              // disabled={isStock}
              id="add_to_cart"
              className=" text-white font-semibold sm:text-sm xls:text-sm xms:text-sm xs:text-sm bg-secondary hover:text-white duration-300 py-2 w-full text-xl cursor-pointer"
            >
              Add to cart
            </button>
          </div>
          <div className="w-full">
            <button
              onClick={() => buyNow()}
              // disabled={isStock}
              id="buy_now"
              className="bg-black text-white md:text-xl  font-semibold text-sm py-2 w-full cursor-pointer"
            >
              Buy now
            </button>
          </div>
        </div>
      </div>

      <div className="py-3 sm:py-1 border-b border-gray-300 block ">
        <div className="flex  items-center space-x-4">
          <p className="font-semibold">Quantity :</p>
          <div className="flex items-center border border-gray-300 rounded-sm">
            <button
              onClick={() => decrement()}
              disabled={isStock}
              className="p-4 xs:p-2 xms:p-2 xls:p-2 border-r border-gray-300"
            >
              <svg
                className="h-3 w-3 fill-current text-gray-400 "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M5 11V13H19V11H5Z"></path>
              </svg>
            </button>
            <div>
              <input
                type="text"
                className="sm:w-[40px] w-[30px]  pl-3 outline-none"
                value={count}
                readOnly
              />
            </div>

            <button
              onClick={() => increment()}
              disabled={isStock}
              className="p-4 xs:p-2 xms:p-2 xls:p-2  border-l border-gray-300"
            >
              <svg
                className="h-3 w-3 fill-current text-gray-400 "
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
              >
                <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      {showSecondDiv && (
        <div
          id="secondDiv"
          className="fixed z-40 bottom-[50px] left-0 right-0 p-1 bg-white  sm:hidden block"
        >
          <div className="py-3 sm:py-1 xls:py-2 xms:py-2 xs:py-2 border-b border-gray-300 flex justify-center">
            <div className="flex  items-center space-x-4">
              <p className="font-semibold">Quantity :</p>
              <div className="flex items-center border border-gray-300 rounded-sm">
                <button
                  onClick={() => decrement()}
                  disabled={isStock}
                  className="p-4 xs:p-2 xms:p-2 xls:p-2 border-r border-gray-300"
                >
                  <svg
                    className="h-3 w-3 fill-current text-gray-400 "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 11V13H19V11H5Z"></path>
                  </svg>
                </button>
                <div>
                  <input
                    type="text"
                    className="w-[40px] xs:w-[30px] xms:w-[30px] xls:w-[30px]  pl-3 outline-none"
                    value={count}
                    readOnly
                  />
                </div>

                <button
                  onClick={() => increment()}
                  disabled={isStock}
                  className="p-4 xs:p-2 xms:p-2 xls:p-2  border-l border-gray-300"
                >
                  <svg
                    className="h-3 w-3 fill-current text-gray-400 "
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-5 w-2/3 md:w-full sm:w-full xls:w-full xms:w-full xs:w-full">
            <div className="w-full">
              <button
                onClick={() => addToCart()}
                // disabled={isStock}
                id="add_to_cart"
                className=" text-white font-semibold sm:text-sm xls:text-sm xms:text-sm xs:text-sm bg-secondary hover:text-white duration-300 py-2 w-full text-xl cursor-pointer"
              >
                Add to cart
              </button>
            </div>
            <div className="w-full">
              <button
                onClick={() => buyNow()}
                // disabled={isStock}
                id="buy_now"
                className="bg-black text-white text-xl  font-semibold sm:text-sm xls:text-sm xms:text-sm xs:text-sm py-2 w-full cursor-pointer"
              >
                Buy now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex xls:hidden xms:hidden xs:hidden items-center space-x-3">
        <div className="w-full">
          <button
            onClick={() => addToCart()}
            // disabled={isStock}
            id="add_to_cart"
            className=" text-white font-semibold sm:text-sm xls:text-sm xms:text-sm xs:text-sm bg-secondary hover:text-white duration-300 py-2 w-full text-xl cursor-pointer"
          >
            Add to cart
          </button>
        </div>
        <div className="w-full">
          <button
            onClick={() => buyNow()}
            // disabled={isStock}
            id="buy_now"
            className="bg-black text-white text-xl  font-semibold sm:text-sm xls:text-sm xms:text-sm xs:text-sm py-2 w-full cursor-pointer"
          >
            Buy now
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-3">
        <div className="w-full bg-green-500 flex justify-center items-center py-3">
          <div>
            <IoCallOutline className="text-white" size={25} />
          </div>
          <div>
            <span className="font-bold text-white sm:text-sm">কল করুন :</span>
            <span className="font-bold text-white sm:text-sm">
              <Link href={`tel:${settingsData?.phone}`} target="_blank">
                {settingsData?.phone}
              </Link>
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-3">
        <div
          className="w-full bg-green-500 flex justify-center items-center py-3 cursor-pointer"
          onClick={() => shareProduct(info)}
        >
          <div>
            <FaWhatsapp className="text-white" size={25} />
          </div>
          <div>
            <span className="font-bold text-white sm:text-sm">
              হোয়াটসঅ্যাপ অর্ডার{" "}
            </span>
          </div>
        </div>
      </div>

      {/* <div className="mt-3 bg-green-200 rounded-md sm:text-sm xls:text-sm xms:text-sm xs:text-sm py-3 pl-3">
        চট্টগ্রাম সিটির বাহিরে হলে ১২০ টাকা অগ্রিম দিতে হবে
      </div> */}
    </div>
  );
};

export default DetailsSection;