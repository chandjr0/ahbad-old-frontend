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
  const [showSecondDiv, setShowSecondDiv] = useState(false);
  const firstDivRef = useRef(null);

  const { cartItems, setCartItems, settingsData } = useStatus();
  const [selected, setSelected] = useState(false);
  const [count, setCount] = useState(1);
  const [AllAttrList, setAllAttrList] = useState([]);
  const [showingVariantList, setShowingVariantList] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [isStock, setIsStock] = useState(true);
  const [totalStock, setTotalStock] = useState(0);

  const [diffTimes, setDiffTimes] = useState();

  const [currentDate, setCurrentDate] = useState(Date.now());

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
            price: info?.isFlashDeal
              ? info?.variations[0]?.flashPrice
              : info?.variations[0]?.sellingPrice,
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
            sku: info?.sku,
            productId: info?._id,
            isVariant: info?.isVariant,
            slug: info?.slug,
            stock: info?.stock || 10,
            quantity: count,
            name: info?.name,
            brand: info?.brand?.name,
            category: info?.categories?.length ? info?.categories[0]?.name : "",
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
    if (info && info?.isVariant && info.variations.length > 0) {
      // take the first attribute object
      let primaryAttr = info?.variations[0].attributeOpts[0]?.attributeName;
      let updateAllAttrList = [];

      // make all attribute list
      let updatePrimaryAttrList = [];
      info?.variations?.forEach((variant) => {
        variant.attributeOpts.forEach((opt) => {
          if (opt.attributeName == primaryAttr) {
            updatePrimaryAttrList.push(opt.name);
          }
          updateAllAttrList.push({
            ...opt,
            variationId: variant._id,
          });
        });
      });

      setAllAttrList(updateAllAttrList);

      // make first attribute values
      let showingVariants = [
        {
          name: primaryAttr,
          values: [...new Set(updatePrimaryAttrList)],
          selectedValue: "",
          variationIds: [],
          nextAttr: info?.variations[0].attributeOpts[1]
            ? info?.variations[0].attributeOpts[1]?.attributeName
            : "", // check if has the next attribute
        },
      ];

      info?.variations[0].attributeOpts?.forEach((opt, index) => {
        if (opt.attributeName !== primaryAttr) {
          showingVariants.push({
            name: opt.attributeName,
            values: [],
            selectedValue: "",
            variationIds: [],
            nextAttr:
              info?.variations[0].attributeOpts.length - 2 >= index
                ? info?.variations[0].attributeOpts[index + 1]?.attributeName
                : "",
          });
        }
      });

      setShowingVariantList(showingVariants);
    }
  }, [info]);

  const handleAttribute = (item, value) => {
    let checkVariantIds = [];
    AllAttrList?.forEach((attr) => {
      if (attr.name == value) {
        checkVariantIds.push(attr.variationId);
      }
    });

    let sizeValues = [];
    let dummyArr = [];
    AllAttrList?.forEach((attr) => {
      if (
        attr.attributeName == item?.nextAttr &&
        checkVariantIds.includes(attr.variationId)
      ) {
        sizeValues.push(attr.name);
        dummyArr.push(attr);
      }
    });

    const selectIndex = showingVariantList.findIndex((x) => x == item);

    setShowingVariantList(
      showingVariantList?.map((val, index) => {
        if (val?.name == item?.nextAttr) {
          return {
            ...val,
            values: [...new Set(sizeValues)],
            selectedValue: "",
          };
        } else if (index > selectIndex) {
          return {
            ...val,
            values: [],
            selectedValue: "",
          };
        } else {
          if (val?.name == item?.name) {
            return {
              ...val,
              selectedValue: value,
            };
          } else {
            return val;
          }
        }
      })
    );
  };

  useEffect(() => {
    if (showingVariantList?.length > 0) {
      let isNotValid = showingVariantList.find(
        (val) => val.selectedValue === ""
      );
      if (!isNotValid) {
        let selectedAttr = showingVariantList?.map((val) => val.selectedValue);
        setSelected(false);
        const checkArrays = info?.variations.map((item) => {
          if (item.attributeOpts) {
            const attributeNames = item.attributeOpts.map((attr) => attr.name);
            if (
              selectedAttr.sort().join("-") === attributeNames.sort().join("-")
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
    const obj = {
      variationId: selectedVariation?._id || "",
      productId: info?._id,
    };

    try {
      let res = await postRequest(
        `product/admin-customer/check-product-stock`,
        obj
      );
      if (res) {
        if (res?.data?.stock >= count + 1) {
          setCount(count + 1);
          toast.success("Success! Quantity Increased");
        } else {
          toast.warning("Warning! No More Stock Left");
        }
      }
    } catch (error) {
      console.log("error in stock check", error);
    }
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

    const obj = {
      eventType: eventname,
      fbClickId: fbc_id || "",
      userIpAddress: userIp || "0.0.0.0",
      userAgent: navigator.userAgent,
      host: "",
      products: e_commerce?.items,
      totalProductPrice: e_commerce?.items[0]?.sellingPrice,
      deliveryAddress: {
        name: "",
        phone: "",
        city: "",
        zone: "",
        address: "",
      },
    };

    trackFacebookEvent(obj);
  };

  // buy now func
  const buyNow = async () => {
    if (isStock) {
      toast.warning("Stock Out !");
      return;
    }

    if (info?.isVariant) {
      let isNotValid = showingVariantList.find(
        (val) => val.selectedValue === ""
      );

      if (selectedVariation !== null && !isNotValid) {
        setCount(1);
        let item = {
          productId: info?._id,
          name: info?.name,
          image: info?.galleryImage,
          price: info?.isFlashDeal
            ? selectedVariation?.flashPrice
            : selectedVariation?.sellingPrice,
          isVariant: info?.isVariant,
          quantity: count,
          variation: selectedVariation,
          variationId: selectedVariation?._id,
          stock: totalStock,
          slug: info?.slug,
          sku: info?.sku,
          category: info?.categories?.length ? info?.categories[0]?.name : "",
        };

        const e_commerce = {
          currency: "BDT",
          items: [
            {
              id: info?.sku,
              name: info?.name,
              brand: info?.brand?.name || "",
              category: info?.categories?.length ? info?.categories[0] : "",
              variant: selectedVariation,
              price: info?.isFlashDeal
                ? selectedVariation?.flashPrice
                : selectedVariation?.sellingPrice,
              quantity: count,
            },
          ],
        };

        const is_exist = cartItems.find(
          (variation) => variation?.variation?._id == item.variation._id
        );

        if (is_exist) {
          router.push("/checkout");
          callDataLayer("buy_now", e_commerce);
          fbAddToCartEvent("AddToCart", e_commerce);
        }

        if (is_exist === undefined) {
          setCartItems((cartItems) => [...cartItems, item]);
          encryptData([...cartItems, item]);
          callDataLayer("buy_now", e_commerce);
          fbAddToCartEvent("AddToCart", e_commerce);

          router.push("/checkout");
        }
      } else {
        setSelected(true);
        toast.warning("Please Select Variation");
      }
    } else {
      setCount(1);

      let item = {
        productId: info?._id,
        name: info?.name,
        image: info?.galleryImage,
        price: info?.isFlashDeal
          ? info?.nonVariation?.flashPrice
          : info?.nonVariation?.sellingPrice,
        isVariant: info?.isVariant,
        quantity: count,
        variation: selectedVariation,
        variationId: selectedVariation?._id,
        stock: totalStock,
        slug: info?.slug,
        sku: info?.sku,
        category: info?.categories?.length ? info?.categories[0]?.name : "",
      };

      const e_commerce = {
        currency: "BDT",
        items: [
          {
            item_id: info?.sku,
            item_name: info?.name,
            item_brand: info?.brand?.name || "",
            item_category: info?.categories?.length ? info?.categories[0] : "",
            item_variant: selectedVariation,
            price: info?.isFlashDeal
              ? info?.nonVariation?.flashPrice
              : info?.nonVariation?.sellingPrice,
            quantity: count,
          },
        ],
      };

      const is_exist = cartItems.find(
        (variation) => variation?.productId == item.productId
      );

      if (is_exist) {
        router.push("/checkout");
        callDataLayer("buy_now", e_commerce);
        fbAddToCartEvent("AddToCart", e_commerce);
      }

      if (is_exist === undefined) {
        setCartItems((cartItems) => [...cartItems, item]);

        // localStorage.setItem("myCartMain", JSON.stringify([...cartItems, item]));
        encryptData([...cartItems, item]);

        callDataLayer("buy_now", e_commerce);
        fbAddToCartEvent("AddToCart", e_commerce);
        toast.success("Success! Item Added to Cart");
        router.push("/checkout");
      }
    }
  };

  // add to cart function
  const addToCart = async () => {
    if (isStock) {
      toast.warning("Stock Out !");
      return;
    }

    if (info?.isVariant) {
      let isNotValid = showingVariantList.find(
        (val) => val.selectedValue === ""
      );
      if (selectedVariation !== null && !isNotValid) {
        setCount(1);

        let item = {
          productId: info?._id,
          name: info?.name,
          image: info?.galleryImage,
          price: info?.isFlashDeal
            ? selectedVariation?.flashPrice
            : selectedVariation?.sellingPrice,
          isVariant: info?.isVariant,
          quantity: count,
          variation: selectedVariation,
          variationId: selectedVariation?._id,
          stock: totalStock,
          slug: info?.slug,
          sku: info?.sku,
          category: info?.categories?.length ? info?.categories[0]?.name : "",
        };

        const e_commerce = {
          currency: "BDT",
          items: [
            {
              id: info?.sku,
              name: info?.name,
              brand: info?.brand?.name || "",
              category: info?.categories?.length ? info?.categories[0] : "",
              variant: selectedVariation,
              price: info?.isFlashDeal
                ? selectedVariation?.flashPrice
                : selectedVariation?.sellingPrice,
              quantity: count,
            },
          ],
        };

        const is_exist = cartItems.find(
          (variation) => variation?.variation?._id == item.variation._id
        );

        if (is_exist) {
          const index = cartItems.findIndex(
            (variation) => variation?.variation == is_exist?.variation
          );

          cartItems[index].quantity += count;
          setCartItems(cartItems);
          encryptData(cartItems);
          // localStorage.setItem("myCartMain", JSON.stringify(cartItems));

          callDataLayer("add_to_cart", e_commerce);
          fbAddToCartEvent("AddToCart", e_commerce);

          toast.success("Success! Item Added to Cart");
        }

        if (is_exist === undefined) {
          setCartItems((cartItems) => [...cartItems, item]);

          encryptData([...cartItems, item]);

          callDataLayer("add_to_cart", e_commerce);
          fbAddToCartEvent("AddToCart", e_commerce);

          toast.success("Success! Item Added to Cart");
        }
      } else {
        setSelected(true);
        toast.warning("Please Select Variation");
      }
    } else {
      setCount(1);
      let item = {
        productId: info?._id,
        name: info?.name,
        image: info?.galleryImage,
        price: info?.isFlashDeal
          ? info?.nonVariation?.flashPrice
          : info?.nonVariation?.sellingPrice,
        isVariant: info?.isVariant,
        quantity: count,
        variation: selectedVariation,
        variationId: selectedVariation?._id,
        stock: totalStock,
        slug: info?.slug,
        sku: info?.sku,
        category: info?.categories?.length ? info?.categories[0]?.name : "",
      };

      const e_commerce = {
        currency: "BDT",
        items: [
          {
            item_id: info?.sku,
            item_name: info?.name,
            item_brand: info?.brand?.name || "",
            item_category: info?.categories?.length ? info?.categories[0] : "",
            item_variant: selectedVariation,
            price: info?.isFlashDeal
              ? info?.nonVariation?.flashPrice
              : info?.nonVariation?.sellingPrice,
            quantity: count,
          },
        ],
      };

      const is_exist = cartItems.find(
        (variation) => variation?.productId == item?.productId
      );

      if (is_exist) {
        const index = cartItems.findIndex(
          (variation) => variation?.productId == is_exist?.productId
        );
        cartItems[index].quantity += count;
        setCartItems(cartItems);
        encryptData(cartItems);
        // localStorage.setItem("myCartMain", JSON.stringify(cartItems));

        callDataLayer("add_to_cart", e_commerce);
        fbAddToCartEvent("AddToCart", e_commerce);
        toast.success("Success! Item Added to Cart");
      }

      if (is_exist === undefined) {
        setCartItems((cartItems) => [...cartItems, item]);
        encryptData([...cartItems, item]);
        // localStorage.setItem("myCartMain", JSON.stringify([...cartItems, item]));

        callDataLayer("add_to_cart", e_commerce);
        fbAddToCartEvent("AddToCart", e_commerce);
        toast.success("Success! Item Added to Cart");
      }
    }
  };

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

  // console.log("settingsData", settingsData);

  return (
    <div className="border border-gray-200 xls:border-none xms:border-none xs:border-none p-4 ">
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
      <p className="text-2xl sm:text-xl xls:text-lg xms:text-lg xs:text-base font-bold tracking-wide pt-3 xls:pt-2 xms:pt-2 xs:pt-1 capitalize">
        {info?.name}
      </p>

      <div className="pt-3 pb-4 flex justify-between items-center border-b border-gray-300">
        <p>
          <span className="uppercase font-bold">SKU:</span>
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
          {info?.isFlashDeal ? (
            <>
              {info?.isVariant && selectedVariation !== null ? (
                <h2 className="font-semibold">
                  {selectedVariation?.regularPrice ==
                  selectedVariation?.sellingPrice ? null : (
                    <span className="line-through text-sm text-black">
                      ৳ {selectedVariation?.regularPrice * count}
                    </span>
                  )}

                  <span className="text-red-600 text-2xl">
                    ৳ {selectedVariation?.flashPrice * count}
                  </span>
                </h2>
              ) : info?.isVariant && selectedVariation == null ? (
                <h2 className="font-semibold ">
                  {info?.variations[0]?.regularPrice ==
                  info?.variations[0].flashPrice ? null : (
                    <span className="line-through text-sm text-black">
                      ৳ {info?.variations[0]?.regularPrice * count}
                    </span>
                  )}

                  <span className="text-red-600 text-2xl">
                    ৳ {info?.variations[0].flashPrice * count}
                  </span>
                </h2>
              ) : (
                <h2 className="font-semibold ">
                  {info?.nonVariation?.regularPrice ==
                  info?.nonVariation.flashPrice ? null : (
                    <span className="line-through text-sm text-black">
                      ৳ {info?.nonVariation?.regularPrice * count}
                    </span>
                  )}

                  <span className="text-red-600 text-2xl">
                    ৳ {info?.nonVariation.flashPrice * count}
                  </span>
                </h2>
              )}
            </>
          ) : info?.isVariant && selectedVariation !== null ? (
            <h2 className="font-semibold">
              {selectedVariation?.regularPrice ==
              selectedVariation?.sellingPrice ? null : (
                <span className="line-through text-sm text-black">
                  ৳ {selectedVariation?.regularPrice * count}
                </span>
              )}

              <span className="text-red-600 text-2xl">
                ৳ {selectedVariation?.sellingPrice * count}
              </span>
            </h2>
          ) : info?.isVariant && selectedVariation == null ? (
            <h2 className="font-semibold ">
              {info?.variations[0]?.regularPrice ==
              info?.variations[0]?.sellingPrice ? null : (
                <span className="line-through text-sm text-black">
                  ৳ {info?.variations[0]?.regularPrice * count}
                </span>
              )}

              <span className="text-red-600 text-2xl">
                ৳ {info?.variations[0]?.sellingPrice * count}
              </span>
            </h2>
          ) : (
            <h2 className="font-semibold ">
              {info?.nonVariation?.regularPrice ==
              info?.nonVariation.sellingPrice ? null : (
                <span className="line-through text-sm text-black">
                  ৳ {info?.nonVariation?.regularPrice * count}
                </span>
              )}

              <span className="text-red-600 text-2xl">
                ৳ {info?.nonVariation?.sellingPrice * count}
              </span>
            </h2>
          )}
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

      {/* <p className="mt-3">Soft and breathable china export fabric</p> */}
      {info?.isVariant == true ? (
        <div className="mt-3 ">
          {showingVariantList?.map((item, Mainindex) => (
            <div key={Mainindex}>
              <div>
                {item?.values?.length > 0 ? <div>{item?.name}</div> : null}
                <div className="grid grid-cols-5  gap-4 mb-3">
                  {item?.values.map((col, index) => (
                    <>
                      {item?.selectedValue == col ? (
                        <button
                          className="px-2 py-2 text-xs text-white bg-gray-800"
                          onClick={() => handleAttribute(item, col)}
                        >
                          {col}
                        </button>
                      ) : (
                        <button
                          className="px-1 py-2 text-xs border border-black"
                          onClick={() => handleAttribute(item, col)}
                        >
                          {col}
                        </button>
                      )}
                    </>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

    {!isStock && <div
        id="firstDiv"
        ref={firstDivRef}
        className=" p-1 bg-white  hidden xls:block xms:block xs:block"
      >
        <div className="py-3 sm:py-1 xls:py-2 xms:py-2 xs:py-2 border-b border-gray-300 flex justify-left">
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
        <div className="grid grid-cols-2 gap-5 w-2/3 md:w-full sm:w-full xls:w-full xms:w-full xs:w-full mt-2">
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
      </div>}
      

      <div className="py-3 sm:py-1 border-b border-gray-300 block xls:hidden xms:hidden xs:hidden">
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
      {showSecondDiv && (
        <div
          id="secondDiv"
          className="fixed z-40 bottom-[50px] left-0 right-0 p-1 bg-white  hidden xls:block xms:block xs:block"
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

      {isStock ? (
        <div className="w-full">
          <button
            onClick={() => addToCart()}
            // disabled={isStock}
            id="add_to_cart"
            className=" text-white font-semibold sm:text-sm xls:text-sm xms:text-sm xs:text-sm bg-secondary hover:text-white duration-300 py-2 w-full text-xl cursor-pointer"
          >
            Out of Stock
          </button>
        </div>
      ) : (
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
      )}

      {settingsData?.productDetails?.showPhone ? (
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
      ) : null}

      {settingsData?.productDetails?.showWhatsapp ? (
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
      ) : null}

      {/* <div className="mt-3 bg-green-200 rounded-md sm:text-sm xls:text-sm xms:text-sm xs:text-sm py-3 pl-3">
        চট্টগ্রাম সিটির বাহিরে হলে ১২০ টাকা অগ্রিম দিতে হবে
      </div> */}
    </div>
  );
};

export default DetailsSection;