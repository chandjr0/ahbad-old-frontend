import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import DesktopImageSection from "./DesktopImageSection";
import MobileImageSection from "./MobileImageSection";
import { parseCookies } from "nookies";
import { useRouter } from "next/navigation";
import { useStatus } from "@/context/contextStatus";
import { toast } from "react-toastify";
import findUserIpAddress from "@/app/api/ip";
import generateUniqueId from "@/app/api/uniqueIds";
import generateFbc from "@/app/api/fb_c";
import generateFbp from "@/app/api/fb_p";
import trackFacebookEvent from "@/app/api/fbEventTracker";
import encryptData from "@/app/api/encrypt";
import postRequest from "@/lib/postRequest";
import DesktopImageSection2 from "./DesktopImageSection2";

const ProductDetails = ({ info }) => {
  const imageGallery = [
    {
      id: 1,
      image: "/image/product1.1.jpg",
    },
    {
      id: 2,
      image: "/image/product1.2.jpg",
    },
    {
      id: 3,
      image: "/image/product2.1.jpg",
    },
    {
      id: 4,
      image: "/image/product2.2.jpg",
    },
  ];
  const cookie = parseCookies();
  const router = useRouter();
  const [showButtons, setShowButtons] = useState(false);
  const firstDivRef = useRef(null);

  const { cartItems, setCartItems, settingsData } = useStatus();
  const [selected, setSelected] = useState(false);
  const [count, setCount] = useState(1);
  const [AllAttrList, setAllAttrList] = useState([]);
  const [showingVariantList, setShowingVariantList] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [isStock, setIsStock] = useState(true);
  const [totalStock, setTotalStock] = useState(0);
  const [selectVariationImage, setSelectVariationImage] = useState();

  const [diffTimes, setDiffTimes] = useState();

  const [currentDate, setCurrentDate] = useState(Date.now());
  const [displayPrice, setDisplayPrice] = useState({
    regularPrice: null,
    sellingPrice: null,
    flashPrice: null,
  });

  useEffect(() => {
    const calculatePrice = () => {
      if (info?.isFlashDeal) {
        if (info?.isVariant && selectedVariation !== null) {
          setDisplayPrice({
            regularPrice:
              selectedVariation?.regularPrice !==
              selectedVariation?.sellingPrice
                ? selectedVariation?.regularPrice * count
                : null,
            flashPrice: selectedVariation?.flashPrice * count,
          });
        } else if (info?.isVariant && selectedVariation == null) {
          setDisplayPrice({
            regularPrice:
              info?.variations[0]?.regularPrice !==
              info?.variations[0]?.flashPrice
                ? info?.variations[0]?.regularPrice * count
                : null,
            flashPrice: info?.variations[0]?.flashPrice * count,
          });
        } else {
          setDisplayPrice({
            regularPrice:
              info?.nonVariation?.regularPrice !==
              info?.nonVariation?.flashPrice
                ? info?.nonVariation?.regularPrice * count
                : null,
            flashPrice: info?.nonVariation?.flashPrice * count,
          });
        }
      } else if (info?.isVariant && selectedVariation !== null) {
        setDisplayPrice({
          regularPrice:
            selectedVariation?.regularPrice !== selectedVariation?.sellingPrice
              ? selectedVariation?.regularPrice * count
              : null,
          sellingPrice: selectedVariation?.sellingPrice * count,
        });
      } else if (info?.isVariant && selectedVariation == null) {
        setDisplayPrice({
          regularPrice:
            info?.variations[0]?.regularPrice !==
            info?.variations[0]?.sellingPrice
              ? info?.variations[0]?.regularPrice * count
              : null,
          sellingPrice: info?.variations[0]?.sellingPrice * count,
        });
      } else {
        setDisplayPrice({
          regularPrice:
            info?.nonVariation?.regularPrice !==
            info?.nonVariation?.sellingPrice
              ? info?.nonVariation?.regularPrice * count
              : null,
          sellingPrice: info?.nonVariation?.sellingPrice * count,
        });
      }
    };

    calculatePrice();
  }, [info, selectedVariation, count]);

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
            variationImage: variant?.images,
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
    AllAttrList?.forEach((attr, index) => {
      if (attr.name == value) {
        checkVariantIds.push(attr.variationId);
        setSelectVariationImage(index);
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
    const productUrl = `https://ahbab.art.com/product/${info.slug}`;
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
    const handleScroll = () => {
      const scrollY = window.scrollY;
      // Show buttons if scrolled down beyond a certain point
      if (scrollY > 700) {
        setShowButtons(true);
      } else {
        setShowButtons(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const getDiscountInfo = (item) => {
    if (item?.isVariant) {
      const discount = item?.variations[0]?.discount;
      return discount?.amount !== 0
        ? { amount: discount.amount, type: discount.discountType }
        : null;
    } else {
      const discount = item?.nonVariation?.discount;
      return discount?.amount !== 0
        ? { amount: discount.amount, type: discount.discountType }
        : null;
    }
  };

  const discountInfo = getDiscountInfo(info);


  const [openIndex, setOpenIndex] = useState([]);

  const handleAccordionClick = (index) => {
    if (openIndex.includes(index)) {
      setOpenIndex(openIndex.filter((i) => i !== index)); // Close if clicked again
    } else {
      setOpenIndex([...openIndex, index]); // Open the clicked accordion
    }
  };
  


  return (
    <div className="base-container py-2">
      <div className="grid grid-cols-12 gap-4 shadow">
        <div className="col-span-12 lg:col-span-6 lg:border-r border-[#919090]">
          <div className="hidden lg:block">
            {/* <DesktopImageSection imageGallery={info?.galleryImage} /> */}
            <DesktopImageSection2 selectVariationImage={selectVariationImage} imageGallery={info?.galleryImage} />

          </div>
          <div className="block lg:hidden">
            <div cla>
              <MobileImageSection imageGallery={info?.galleryImage} />
            </div>
          </div>
        </div>
        <div className=" col-span-12 lg:col-span-6 py-4  md:px-12  lg:px-16">
          {/* <div className="breadcrumbs text-[10px] font-semibold text-[#6f6c6c] uppercase">
            <ul>
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Shop</a>
              </li>
              <li>Cutout Waist Long Sleeve Jersey Gown</li>
            </ul>
          </div> */}
          <div className="mt-4">
            {/* <Image
              src="/image/product-company-logo.webp"
              width={0}
              height={0}
              sizes={100}
              alt="logo"
              className="w-[155px] h-[30px]"
            /> */}
            <h2 className="text-xl md:text-3xl font-medium md:leading-6 mt-8 text-[#262626] ">
              {info?.name}
            </h2>

            <div className="flex items-center gap-2 mt-8">
              {/* <p className="text-[10px] border border-red-500 text-red-500 py-2 px-4">
                -14%
              </p> */}

              {discountInfo && (
                <p className="text-[10px] border border-red-500 text-red-500 py-2 px-4">
                  -{discountInfo.amount}
                  {discountInfo.type === "FLAT" ? " Discount" : "% off"}
                </p>
              )}
              {/* <p className="text-[#262626] font-medium">
                $2,400.00 – $2,650.00
              </p> */}
              <div>
                <h2 className="">
                  <span className="text-[#262626] text-2xl font-medium">
                    ৳ {displayPrice.flashPrice || displayPrice.sellingPrice}
                  </span>

                  {displayPrice.regularPrice && (
                    <span className="text-red-600 line-through font-medium ml-2">
                      ৳ {displayPrice.regularPrice}
                    </span>
                  )}
                </h2>
              </div>
            </div>

            <p className="mt-6 text-sm text-black leading-7 xl:w-[40rem] ">
              A shapely halter dress designed with slinky crossback straps and a
              leg-baring slit is an elegant option for your upcoming event.
            </p>
          </div>

          {/* <div className="mt-6">
            <p className="uppercase font-semibold text-sm ">Size</p>
            <div className="flex gap-2 mt-2">
              <p className="border border-[#bdbcbc] hover:border-black py-2 px-4 text-sm ">
                1
              </p>
              <p className="border border-[#bdbcbc] hover:border-black py-2 px-4 text-sm ">
                2
              </p>
              <p className="border border-[#bdbcbc] hover:border-black py-2 px-4 text-sm ">
                3
              </p>
              <p className="border border-[#bdbcbc] hover:border-black py-2 px-4 text-sm ">
                4
              </p>
            </div>
          </div> */}

          {info?.isVariant == true ? (
            <div className="mt-6">
              {showingVariantList?.map((item, Mainindex) => (
                <div key={Mainindex}>
                  <div>
                    {item?.values?.length > 0 ? (
                      <p className="uppercase font-semibold text-sm ">
                        {item?.name}
                      </p>
                    ) : null}

                    <div className="flex gap-2 mt-2">
                      {item?.values.map((col, index) => (
                        <button
                          key={index}
                          className={`px-2 py-2 text-xs ${
                            item?.selectedValue === col
                              ? "text-white bg-gray-800"
                              : "border border-black"
                          }`}
                          onClick={() => handleAttribute(item, col)}
                        >
                          {col}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          {/* <div className="mt-6">
            <p className="uppercase font-semibold text-sm ">Color</p>
            <div className="flex gap-2 mt-2">
              <p className="bg-black h-6 w-6 rounded-full"></p>
              <p className="bg-[#003863] h-6 w-6 rounded-full"></p>
              <p className="bg-[#471C00] h-6 w-6 rounded-full"></p>
            </div>
          </div> */}

          {/* <p className="text-[#262626] font-medium mt-4">
            ৳ {displayPrice.flashPrice || displayPrice.sellingPrice}
          </p> */}

          <div className="mt-6 flex flex-wrap gap-4 md:gap-10 lg:gap-16">
            <p className="text-[12px] uppercase font-medium text-[#767676]">
              Sku : {info?.sku}
            </p>
            <p className="text-[12px] uppercase font-medium text-[#767676]">
              Brand : {info?.brand?.name}
            </p>
            <p className="text-[12px] uppercase font-medium text-[#767676]">
              Stock :{" "}
              {isStock ? (
                <span className="pl-2 text-red-500 font-bold">Stock Out</span>
              ) : (
                <span className="pl-2 text-green-500 font-bold">In Stock</span>
              )}
            </p>
          </div>

          {isStock ? (
            <div className="mt-6 w-[14rem]">
              <button
                disabled={isStock}
                id="add_to_cart"
                className="px-4 py-3 w-full rounded text-white flex-grow text-[12px] font-bold bg-[#ff0707]  uppercase"
              >
                Out of Stock
              </button>
            </div>
          ) : (
            <>
              <div className="flex gap-2 mt-6 md:w-[22rem]">
                <div className="flex border border-gray-300 rounded px-4 py-3 flex-grow">
                  <button
                    onClick={() => decrement()}
                    disabled={isStock}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    -
                  </button>
                  <input
                    className="w-24 md:w-20 text-center border-none outline-none focus:ring-0 focus:outline-none bg-transparent"
                    value={count}
                    onChange={(e) => {
                      const value = e.target.value;

                      // Allow the user to type, and temporarily allow empty value for input
                      setCount(value);
                    }}
                    onBlur={() => {
                      // Validate the input when the user finishes typing (on blur)
                      if (count === "" || isNaN(count) || Number(count) < 1) {
                        setCount(1); // Reset to 1 if the value is invalid
                      } else {
                        setCount(Number(count)); // Ensure the value is a number
                      }
                    }}
                  />
                  <button
                    onClick={() => increment()}
                    disabled={isStock}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={addToCart}
                  disabled={isStock}
                  id="add_to_cart"
                  className="px-4 py-3 w-full hover:bg-black bg-white hover:bg-[070707] hover:text-white border border-black text-black font-medium flex-grow text-[12px]  uppercase"
                >
                  Add to Cart
                </button>
              </div>

              <button
                onClick={() => buyNow()}
                // disabled={isStock}
                id="buy_now"
                className="mt-6 px-4 py-4 border bg-secondary text-white font-medium w-full md:w-[22rem] text-[12px] hover:bg-[#070707] hover:text-white uppercase"
              >
                Buy Now
              </button>
            </>
          )}

          <div class="mt-12">
            {/* <h2 class="text-lg font-bold mb-4">DESCRIPTION</h2> */}

            {/* <div
              className="text-black"
              dangerouslySetInnerHTML={{ __html: info?.description }}
            ></div> */}

            <div className="mt-6">
              {/* Accordion 1 */}
              <div className="collapse collapse-plus border-[#919090] border-y rounded-none group">
                <input
                  type="checkbox"
                  checked={openIndex.includes(0)}
                  onChange={() => handleAccordionClick(0)}
                />
                <div className="collapse-title  text-black text-sm font-bold uppercase group-hover:text-[#FC5F49]">
                  Product Details
                </div>
                {openIndex.includes(0) && (
                  <div className="collapse-content">
                    <div
                      className="text-black"
                      dangerouslySetInnerHTML={{ __html: info?.description }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Accordion 2 */}
              <div className="collapse collapse-plus border-[#919090]  border-y rounded-none mt-2 group">
                <input
                  type="checkbox"
                  checked={openIndex.includes(1)}
                  onChange={() => handleAccordionClick(1)}
                />
                <div className="collapse-title text-black text-sm font-bold uppercase group-hover:text-[#FC5F49]">
                  Reviews
                </div>
                {openIndex.includes(1) && (
                  <div className="collapse-content">
                    <p></p>
                  </div>
                )}
              </div>
            </div>

            {/* <ul class=" text-sm text-[#767676]  list-disc list-inside space-y-1">
              <li>42{"'"} center front length</li>
              <li>Halter neck</li>
              <li>Sleeveless</li>
              <li>Lined</li>
              <li>95% polyester, 5% spandex</li>
              <li>Machine wash, line dry</li>
              <li>Imported</li>
            </ul>

            <p class="mt-6 text-sm  text-[#767676] leading-6 xl:w-[40rem]  ">
              Prada time and time again proves themselves an influential force
              in the fashion industry. For over 100 years, Prada has designed
              and sold beautifully crafted and ingenious handbags, clothes,
              shoes, and accessories for women, men, and now children. Prada
              today has become synonymous with luxury goods and never fails to
              disappoint year-in and year-out.
            </p> */}
          </div>

          <div>
            {/* <div class="mt-6">
              <h2 class="text-lg font-bold mb-4">ADDITIONAL INFORMATION</h2>
              <div class="border-t border-b border-gray-300 py-3 flex justify-between">
                <div class="flex items-center gap-2 text-sm">
                  <p class="">Size : </p>
                  <p class="text-[#767676]">2, 4, 6, 8</p>
                </div>
                <div class="flex items-center gap-2 text-sm">
                  <p class="">Color : </p>
                  <p class="text-[#767676]">Black, Blue, Red</p>
                </div>
                <div></div>
              </div>
            </div> */}
          </div>
        </div>
      </div>

      {/* Add to Cart and Buy Now buttons */}
      <div className="flex md:hidden">
        {showButtons && (
          <div className="fixed bottom-0 left-0 z-40 right-0 bg-white shadow-md p-2 ">
            <div className="flex justify-center  px-4 py-3 flex-grow">
              <span className="font-bold font bold text-black mr-4">
                Quantity:
              </span>
              <button
                onClick={() => decrement()}
                disabled={isStock}
                className="text-gray-500 hover:text-gray-700 border w-10"
              >
                -
              </button>
              <input
                className="text-black w-12 text-center border-none outline-none focus:ring-0 focus:outline-none bg-transparent"
                value={count}
                onChange={(e) => {
                  const value = e.target.value;

                  // Allow the user to type, and temporarily allow empty value for input
                  setCount(value);
                }}
                onBlur={() => {
                  // Validate the input when the user finishes typing (on blur)
                  if (count === "" || isNaN(count) || Number(count) < 1) {
                    setCount(1); // Reset to 1 if the value is invalid
                  } else {
                    setCount(Number(count)); // Ensure the value is a number
                  }
                }}
              />
              <button
                onClick={() => increment()}
                disabled={isStock}
                className="text-gray-500 hover:text-gray-700 border w-10"
              >
                +
              </button>
            </div>
            <div className="flex justify-between gap-2">
              <button
                disabled={isStock}
                onClick={addToCart}
                className="px-4 py-3 w-full hover:bg-black bg-white hover:bg-[070707] hover:text-white border border-black text-black font-medium flex-grow text-[10px] uppercase"
              >
                Add to Cart
              </button>
              <button
                onClick={buyNow}
                className="px-4 py-3 border bg-secondary text-white font-medium w-full text-[10px] hover:bg-[#070707] hover:text-white uppercase"
              >
                Buy Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
