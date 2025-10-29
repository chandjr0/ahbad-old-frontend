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
import { FaWhatsapp } from "react-icons/fa6";
import { RiMessengerLine } from "react-icons/ri";
import BreadCrumbs from "../../Common/Breadcumb";
import { baseUrl } from "@/config";
import { v4 as uuidv4 } from "uuid";
import Gtm from "@/app/Gtm";
import wishlistEncrypt from "@/app/api/wishlistEncrypt";
import ViewContent from "@/app/api/conversion/ViewContent";
import AddToCart from "@/app/api/conversion/AddToCart";

const ProductDetails2 = ({ info }) => {
  const cookie = parseCookies();
  const router = useRouter();
  const [showButtons, setShowButtons] = useState(false);
  const firstDivRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    cartItems,
    setCartItems,
    settingsData,
    wishlistItems,
    setWishlistItems,
  } = useStatus();
  const [selected, setSelected] = useState(false);
  const [count, setCount] = useState(1);
  const [AllAttrList, setAllAttrList] = useState([]);
  const [showingVariantList, setShowingVariantList] = useState([]);
  const [selectedVariation, setSelectedVariation] = useState(null);
  const [isStock, setIsStock] = useState(true);
  const [totalStock, setTotalStock] = useState(0);
  const [selectVariationImage, setSelectVariationImage] = useState();
  const [productImages, setProductImages] = useState([]);
  const [imagesWithVariationIds, setImagesWithVariationIds] = useState([]);

  const [diffTimes, setDiffTimes] = useState();

  const [currentDate, setCurrentDate] = useState(Date.now());
  const [displayPrice, setDisplayPrice] = useState({
    regularPrice: null,
    sellingPrice: null,
    flashPrice: null,
  });
  const [gtmProductView, setGtmProductView] = useState({});
  const [gtmCart, setGtmCart] = useState({});
  const [isAddedToCart, setIsAddedToCart] = useState(false);

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
    const generateEcommercePayload = (info, isVariant) => {
      const price = isVariant
        ? info?.variations?.[0]?.flashPrice ||
        info?.variations?.[0]?.sellingPrice
        : info?.nonVariation?.flashPrice || info?.nonVariation?.sellingPrice;

      const productInfo = {
        event: "view_item",
        eventID: null,
        plugin: "StoreX",
        currency: "BD",
        value: price,
        customer: {
          id: 0,
          billing: {
            first_name: "",
            last_name: "",
            company: "",
            address_1: "",
            address_2: "",
            city: "",
            zone: "",
            postcode: "",
            country: "BD",
            email: "",
            phone: "",
          },
        },
        items: [
          {
            item_id: info?.sku,
            item_name: info?.name,
            discount: displayPrice?.regularPrice || 0,
            index: 0,
            item_brand: info?.brand?.name || "",
            item_category: info?.categories?.length
              ? info?.categories[0]?.name
              : "",
            price: price,
            quantity: 1,
          },
        ],
      };

      return productInfo;
    };

    if (info) {
      const isVariant = info?.isVariant;
      const e_commerce = generateEcommercePayload(info, isVariant);
      setGtmProductView(e_commerce);
    }
  }, [info]);

  useEffect(() => {
    if (info && info?.isVariant && info.variations.length > 0) {
      // Create a map to store unique attributes and their values
      const attributeMap = new Map();
      
      // Process all variations to collect unique attributes and their values
      info.variations.forEach(variant => {
        variant.attributeOpts.forEach(opt => {
          if (!attributeMap.has(opt.attributeName)) {
            attributeMap.set(opt.attributeName, new Set());
          }
          attributeMap.get(opt.attributeName).add(opt.name);
        });
      });

      // Convert the map to the required format
      const showingVariants = Array.from(attributeMap).map(([attrName, values], index) => ({
        name: attrName,
        values: Array.from(values),
        selectedValue: "",
        variationIds: [],
        nextAttr: index < attributeMap.size - 1 
          ? Array.from(attributeMap.keys())[index + 1]
          : ""
      }));

      setShowingVariantList(showingVariants);
      setAllAttrList(info.variations.flatMap(variant => 
        variant.attributeOpts.map(opt => ({
          ...opt,
          variationId: variant._id
        }))
      ));
    }
  }, [info]);


  useEffect(() => {
    if (info) {
      let filteredVariation = [];
      if (info?.variations && info?.variations?.length > 0) {
        filteredVariation = info?.variations.filter(
          (item) => item.status === "active"
        );
      }
      
      const firstVariation = filteredVariation && filteredVariation?.length > 0
        ? filteredVariation[0]
        : null;
      
      setSelectedVariation(firstVariation);
      
      // Collect all images from variations and gallery with their variation IDs
      const galleryImages = (info.galleryImage || []).map(img => ({
        url: img,
        variationId: null // null for gallery images
      }));

      const variationImages = info.variations?.reduce((acc, variation) => {
        if (variation.images && variation.images.length > 0) {
          const imagesWithId = variation.images.map(img => ({
            url: img,
            variationId: variation._id
          }));
          acc.push(...imagesWithId);
        }
        return acc;
      }, []);
      
      // Combine and remove duplicates while preserving variation IDs
      const uniqueImagesWithIds = [...variationImages, ...galleryImages].filter((item, index, self) =>
        index === self.findIndex((t) => t.url === item.url)
      );

      setImagesWithVariationIds(uniqueImagesWithIds);
      // Set product images array with just the URLs for existing functionality
      setProductImages(uniqueImagesWithIds.map(item => item.url));
      
      // Set initial active image
      if (firstVariation?.images?.length > 0) {
        setSelectVariationImage(firstVariation.images[0]);
      } else if (uniqueImagesWithIds.length > 0) {
        setSelectVariationImage(uniqueImagesWithIds[0].url);
      }
    }
  }, [info]);

  // Handle attribute selection for variations
  const handleAttribute = (value, attributeName) => {
    try {
      if (!info?.variations || !info.variations.length) {
        console.error("No variations available");
        return;
      }

      // Get active variations
      const activeVariations = info.variations.filter(
        (item) => item.status === "active"
      );
      
      // Update selected values
      const updatedVariantList = [...showingVariantList];
      const existingAttrIndex = updatedVariantList.findIndex(
        (attr) => attr.name === attributeName
      );
      
      if (existingAttrIndex !== -1) {
        updatedVariantList[existingAttrIndex].selectedValue = value;
      } else {
        updatedVariantList.push({ name: attributeName, selectedValue: value });
      }
      
      setShowingVariantList(updatedVariantList);

      // Find matching variation based on selected attributes
      const selectedAttributes = updatedVariantList.filter(attr => attr.selectedValue !== "");
      
      // Only proceed with full match if all attributes are selected
      const allAttributesSelected = selectedAttributes.length === showingVariantList.length;
      
      if (allAttributesSelected) {
        // Find exact matching variation
        const matchingVariation = activeVariations.find((variation) => {
          return selectedAttributes.every(selectedAttr => 
            variation.attributeOpts.some(
              opt => opt.attributeName === selectedAttr.name && 
                    opt.name === selectedAttr.selectedValue
            )
          );
        });

        if (matchingVariation) {
          setSelectedVariation(matchingVariation);
          setCount(1);
          setIsStock(matchingVariation.stock > 0);
          setTotalStock(matchingVariation.stock);

          // Find and select the first image associated with this variation
          const variationImage = imagesWithVariationIds.find(img => img.variationId === matchingVariation._id);
          if (variationImage) {
            setSelectVariationImage(variationImage.url);
          }
        }
      }
    } catch (error) {
      console.error("Error in handleAttribute:", error);
    }
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

  // buy now func
  const buyNow = async () => {
    if (isStock) {
      toast.warning("Stock Out !");
      return;
    }

    const price = info?.isVariant
      ? info?.variations?.[0]?.sellingPrice
      : info?.nonVariation?.sellingPrice;
    const stackAvailable = info?.isVariant
      ? info?.variations?.[0]?.stock
      : info?.nonVariation?.stock;

    // Override with selectedVariation data if available
    const finalPrice = selectedVariation?.sellingPrice || price;
    const finalStockAvailable = selectedVariation?.stock || stackAvailable;

    const value = {
      sku: info?.sku,
      productId: info?._id,
      categoryName: info?.categories?.[0]?.name || "",
      name: info?.name,
      qty: count,
      price: finalPrice,
      description: info?.description,
      stackAvailable: finalStockAvailable,
      shipping: 0,
    };

    if (info?.isVariant) {
      let isNotValid = showingVariantList.find(
        (val) => val.selectedValue === ""
      );

      if (selectedVariation !== null && !isNotValid) {
        let cartItem = {
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

        const e_commerce = generateEcommercePayload(
          info,
          true,
          count,
          selectedVariation
        );
        setGtmCart(e_commerce);

        // Check if this specific variation exists in cart
        const existingItem = cartItems.find(
          item => item.productId === cartItem.productId && 
                  item.variationId === cartItem.variationId
        );

        if (existingItem) {
          // Update the quantity of existing item
          const updatedCartItems = cartItems.map(item => {
            if (item.productId === cartItem.productId && 
                item.variationId === cartItem.variationId) {
              return { ...item, quantity: item.quantity + count };
            }
            return item;
          });
          
          setCartItems(updatedCartItems);
          encryptData(updatedCartItems);
        } else {
          // Add new item to cart
          setCartItems(prevItems => [...prevItems, cartItem]);
          encryptData([...cartItems, cartItem]);
        }
        
        localStorage.setItem("buyNowToCart", JSON.stringify(value));
        router.push("/checkout");
      } else {
        setSelected(true);
        toast.warning("Please Select Variation");
        return;
      }
    } else {
      let cartItem = {
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
      
      const e_commerce = generateEcommercePayload(
        info,
        false,
        count,
        selectedVariation
      );
      setGtmCart(e_commerce);

      // Check if product exists
      const existingItem = cartItems.find(
        item => item.productId === cartItem.productId
      );

      if (existingItem) {
        // Update the quantity of existing item
        const updatedCartItems = cartItems.map(item => {
          if (item.productId === cartItem.productId) {
            return { ...item, quantity: item.quantity + count };
          }
          return item;
        });
        
        setCartItems(updatedCartItems);
        encryptData(updatedCartItems);
      } else {
        // Add new item to cart
        setCartItems(prevItems => [...prevItems, cartItem]);
        encryptData([...cartItems, cartItem]);
      }
      
      localStorage.setItem("buyNowToCart", JSON.stringify(value));
      router.push("/checkout");
    }
  };

  // add to cart function
  const generateEcommercePayload = (
    info,
    isVariant,
    count,
    selectedVariation
  ) => {
    const price = isVariant
      ? selectedVariation?.flashPrice || selectedVariation?.sellingPrice
      : info?.nonVariation?.flashPrice || info?.nonVariation?.sellingPrice;

    const productInfo = {
      event: "add_to_cart",
      eventID: null,
      plugin: "StoreX",
      currency: "BDT",
      value: price * count, // Total price for the quantity
      customer: {
        id: 0,
        billing: {
          first_name: "",
          last_name: "",
          company: "",
          address_1: "",
          address_2: "",
          city: "",
          zone: "",
          postcode: "",
          country: "BD",
          email: "",
          phone: "",
        },
      },
      items: [
        {
          item_id: info?.sku,
          item_name: info?.name,
          discount: selectedVariation?.regularPrice || 0,
          index: 0,
          item_brand: info?.brand?.name || "",
          item_category: info?.categories?.length
            ? info?.categories[0]?.name
            : "",
          price: price,
          quantity: count,
        },
      ],
    };

    return productInfo;
  };

  console.log("selectedVariation", selectedVariation);
  const addToCart = async () => {
    if (isStock) {
      toast.warning("Stock Out !");
      return;
    }

    let item;
    let e_commerce;

    if (info?.isVariant) {
      let isNotValid = showingVariantList.find(
        (val) => val.selectedValue === ""
      );
      if (selectedVariation !== null && !isNotValid) {
        item = {
          productId: info?._id,
          name: info?.name,
          image: info?.galleryImage,
          price: info?.isFlashDeal
            ? selectedVariation?.flashPrice
            : selectedVariation?.sellingPrice,
          isVariant: info?.isVariant,
          quantity: count,
          shortDescription: info?.shortDescription,
          brand: info?.brand,
          variation: selectedVariation,
          variationId: selectedVariation?._id,
          description: info?.description,
          stock: totalStock,
          slug: info?.slug,
          sku: info?.sku,
          category: info?.categories?.length ? info?.categories[0]?.name : "",
        };

        e_commerce = generateEcommercePayload(
          info,
          true,
          count,
          selectedVariation
        );
        setGtmCart(e_commerce);
      } else {
        setSelected(true);
        toast.warning("Please Select Variation");
        return;
      }
    } else {
      item = {
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

        description: info?.description,
        shortDescription: info?.shortDescription,
        brand: info?.brand,
        stock: totalStock,
        slug: info?.slug,
        sku: info?.sku,
        category: info?.categories?.length ? info?.categories[0]?.name : "",
      };

      e_commerce = generateEcommercePayload(
        info,
        false,
        count,
        selectedVariation
      );
      setGtmCart(e_commerce);
    }

    // Check if product with same variation exists in cart
    const existingItem = info?.isVariant 
      ? cartItems.find(cartItem => 
          cartItem.productId === item.productId && 
          cartItem.variationId === item.variationId
        )
      : cartItems.find(cartItem => cartItem.productId === item.productId);

    if (existingItem) {
      // Update quantity of existing item with same variation
      const updatedCartItems = cartItems.map(cartItem => {
        if ((info?.isVariant && 
            cartItem.productId === item.productId && 
            cartItem.variationId === item.variationId) ||
            (!info?.isVariant && cartItem.productId === item.productId)) {
          return {
            ...cartItem,
            quantity: cartItem.quantity + count
          };
        }
        return cartItem;
      });
      
      setCartItems(updatedCartItems);
      encryptData(updatedCartItems);
      setIsAddedToCart(true);
      toast.success("Success! Item quantity updated in cart");
    } else {
      // Add new item to cart
      const updatedCartItems = [...cartItems, item];
      setCartItems(updatedCartItems);
      encryptData(updatedCartItems);
      setIsAddedToCart(true);
      toast.success("Success! Item added to cart");
    }
  };

  const wishList = async () => {
    let item;

    if (info?.isVariant) {
      let isNotValid = showingVariantList.find(
        (val) => val.selectedValue === ""
      );
      if (selectedVariation !== null && !isNotValid) {
        item = {
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
      } else {
        setSelected(true);
        toast.warning("Please Select Variation");
        return;
      }
    } else {
      item = {
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
    }

    const is_exist = wishlistItems.find(
      (variation) => variation?.productId == item?.productId
    );

    if (is_exist) {
      const index = wishlistItems.findIndex(
        (variation) => variation?.productId == is_exist?.productId
      );
      // wishlistItems[index].quantity += count;

      // Ensure you create a new array to trigger state updates
      setWishlistItems(wishlistItems);
      wishlistEncrypt(wishlistItems);

      toast.success("Success! Item Added to Cart");
    } else {
      const updatedWishlist = [...wishlistItems, item];
      setWishlistItems(updatedWishlist);
      wishlistEncrypt(updatedWishlist);

      toast.success("Success! Item Added to Wishlist");
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
    const productUrl = `https://ahbab.art/product/${info.slug}`;
    const shareText = `price: ${info?.isFlashDeal
        ? info?.isVariant
          ? info?.variations[0]?.flashPrice
          : info?.nonVariation?.flashPrice
        : info?.isVariant
          ? info?.variations[0]?.sellingPrice
          : info?.nonVariation?.sellingPrice
      } ${productUrl} `;
    const url = `https://wa.me/+88${settingsData?.socialLinks?.whatsapp
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

  const breadCumbs = [
    { name: "Home", url: "/" },
    {
      name: "product-details",
      // url: "/product-details",
    },
    { name: `${info?.slug}`, url: `/${info?.slug}` },
  ];

  // const whatsappLink = `https://api.whatsapp.com/send/?phone=88${siteSettings.productDetailsWhatsappNumber}&text=${encodeURI(
  //   `Hi ${siteSettings.brandname}. I Want To Buy ${product.title} | Price: ${calculatedPrice}${settings.currency} | ${settings.httpPath}/products/${product.slug}`
  // )}`;
  const discountPrice =
    displayPrice?.regularPrice -
    (displayPrice?.flashPrice || displayPrice?.sellingPrice);

  const whatsappLink = `https://api.whatsapp.com/send/?phone=88${settingsData?.socialMediaSharing?.whatsappNumber
    }&text=${encodeURI(
      `Hi. I Want To Buy ${info?.name} | Price: Regular ${displayPrice?.regularPrice
      } TK, After Discount ${displayPrice?.flashPrice || displayPrice?.sellingPrice
      } TK (You Save: ${discountPrice} TK) | ${baseUrl}/product/${info?.slug}`
    )}`;

  const messengerLink = `https://m.me/${settingsData?.socialMediaSharing?.facebookPageName
    }?text=${encodeURI(
      `Hi. I Want To Buy ${info?.name} | Price: Regular ${displayPrice?.regularPrice
      } TK, After Discount ${displayPrice?.flashPrice || displayPrice?.sellingPrice
      } TK (You Save: ${discountPrice} TK) | ${baseUrl}/product/${info?.slug}`
    )}`;

  // Set loading state when info changes
  useEffect(() => {
    if (info) {
      setIsLoading(false);
    }
  }, [info]);

  return (
    <>
      {isLoading ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
            <p className="text-gray-500 text-lg">Loading product details...</p>
          </div>
        </div>
      ) : !info ? (
        <div className="min-h-screen flex items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <p className="text-gray-500 text-lg">No product details available</p>
          </div>
        </div>
      ) : (
        <div>
          <ScrollToTop />
          {gtmProductView?.value && <Gtm data={gtmProductView} />}
          {gtmCart?.value && <Gtm data={gtmCart} />}

          {/* conversion api  */}
          <ViewContent info={info} selectedVariation={selectedVariation} />
          {isAddedToCart && (
            <AddToCart
              info={info}
              selectedVariation={selectedVariation}
              isAddedToCart={isAddedToCart}
              count={count}
            />
          )}

          <div className="bg-[#E5E7EB]">
            <div className="base-container hidden lg:block">
              <div className=" breadcrumbs text-sm !py-3">
                <BreadCrumbs breadCumbs={breadCumbs} />
              </div>
            </div>

            {/* <div className="max-w-7xl sm:max-w-[45rem]  xls:max-w-[25rem] xms:max-w-[21rem] xs:max-w-[18rem] mx-auto">
              <ProductSectionSlug params={params} />
            </div> */}
          </div>

          <div className="base-container py-2">
            <div className="grid grid-cols-12 gap-4 ">
              <div className="col-span-12 lg:col-span-6">
                <div className="hidden lg:block">
                  <DesktopImageSection2
                    selectVariationImage={selectVariationImage}
                    imageGallery={productImages}
                    setSelectVariationImage={setSelectVariationImage}
                    imagesWithVariationIds={imagesWithVariationIds}
                    selectedVariation={selectedVariation}
                  />
                </div>
                <div className="block lg:hidden">
                  <div>
                    <MobileImageSection 
                      imageGallery={productImages}
                      selectVariationImage={selectVariationImage}
                      setSelectVariationImage={setSelectVariationImage}
                      imagesWithVariationIds={imagesWithVariationIds}
                      selectedVariation={selectedVariation}
                    />
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
                  <h2 className="text-xl md:text-3xl font-bold md:leading-8 mt-8 text-primary">
                    {info?.name}
                  </h2>

                  <div className="flex items-center gap-2 mt-4">
                    {/* <p className="text-[10px] border border-red-500 text-red-500 py-2 px-4">
                    -14%
                  </p> */}

                    {/* {discountInfo && (
                    <p className="text-[10px] border border-red-500 text-red-500 py-2 px-4">
                      -{discountInfo.amount}
                      {discountInfo.type === "FLAT" ? " Discount" : "% off"}
                    </p>
                  )} */}
                    {/* <p className="text-[#262626] font-medium">
                    $2,400.00 – $2,650.00
                  </p> */}
                    <div>
                      <h2 className="">
                        <span className="text-orange-500 font-bold text-2xl">
                          TK {displayPrice.flashPrice || displayPrice.sellingPrice}
                        </span>

                        {displayPrice.regularPrice && (
                          <span className="text-[#666666] text-xl line-through font-medium ml-2">
                            TK {displayPrice.regularPrice}
                          </span>
                        )}
                      </h2>
                    </div>
                  </div>
                </div>

                {info?.shortDescription && info.shortDescription.trim() !== "" && (
                  <div
                    className="text-black mt-2 hidden lg:block"
                    dangerouslySetInnerHTML={{ __html: info?.shortDescription }}
                  ></div>
                )}

                {info?.isVariant == true ? (
                  <div className="mt-4">
                    {showingVariantList?.map((item, Mainindex) => (
                      <div key={Mainindex} className="mb-2">
                        <div>
                          {item?.values?.length > 0 ? (
                            <p className="uppercase font-semibold text-black text-sm ">
                              {item?.name}
                            </p>
                          ) : null}

                          <div className="flex flex-wrap gap-2 mt-2">
                            {item?.values.map((col, index) => (
                              <button
                                key={index}
                                className={`px-4 py-2 text-xs ${item?.selectedValue === col
                                    ? "text-white bg-primary"
                                    : "border border-black"
                                  }`}
                                onClick={() => handleAttribute(col, item.name)}
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

                {isStock ? (
                  <div className="mt-6 md:w-[421px] flex gap-2 ">
                    <button
                      className="bg-primary text-white text-[10px] md:text-sm py-1 px-4 "
                      onClick={() => wishList()}
                    >
                      <i className="text-lg ri-heart-3-line"></i>
                    </button>
                    <button
                      disabled={isStock}
                      id="add_to_cart"
                      className="px-4 py-3 w-full  text-white font-medium flex-grow text-[12px] bg-gradient-to-r from-[#232460] to-[#0E0F51] uppercase"
                    >
                      Out of Stock
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex gap-2 mt-6 md:w-[421px]">
                      <div className="flex border border-gray-300 rounded items-center">
                        <button
                          onClick={() => decrement()}
                          disabled={isStock}
                          className="w-16 text-gray-500 hover:text-gray-700 px-3 py-2 border-r border-gray-300"
                        >
                          -
                        </button>
                        <input
                          className="w-16  text-center border-none outline-none focus:ring-0 bg-transparent"
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
                          className="w-16 text-gray-500 hover:text-gray-700 px-3 py-2 border-l border-gray-300"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={addToCart}
                        disabled={isStock}
                        id="add_to_cart"
                        className="px-4 py-3 w-full hover:bg-primary bg-white hover:bg-[070707] hover:text-white border border-black text-black font-medium flex-grow text-[12px]  uppercase"
                      >
                        Add to Cart
                      </button>
                    </div>

                    <div className="flex gap-2 mt-3 w-full md:w-[421px] ">
                      <button
                        className="bg-primary text-white text-[10px] md:text-sm py-1 px-4 "
                        onClick={() => wishList()}
                      >
                        <i className="text-lg ri-heart-3-line"></i>
                      </button>

                      <button
                        onClick={() => buyNow()}
                        // disabled={isStock}
                        id="buy_now"
                        className="px-4 py-4 border bg-secondary text-white font-medium w-full  text-[12px]  hover:bg-primary hover:text-white uppercase"
                      >
                        Buy Now
                      </button>
                    </div>
                  </>
                )}

                <div className="mt-3 md:w-[421px] flex gap-2">
                  {settingsData?.socialMediaSharing?.whatsappNumber && (
                    <a
                      href={whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-4 border bg-[#25D366] text-white font-medium w-full text-sm uppercase flex items-center justify-center gap-4"
                    >
                      <FaWhatsapp size={20} /> WhatsApp
                    </a>
                  )}

                  {settingsData?.socialMediaSharing?.facebookPageName && (
                    <a
                      href={messengerLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-4 border bg-[#2196F3] text-white font-medium w-full text-sm uppercase flex items-center justify-center gap-4"
                    >
                      <RiMessengerLine size={20} /> Messenger
                    </a>
                  )}

                  {/* <button className="px-4 py-4 border bg-[#2196F3] text-white font-medium w-full text-sm uppercase flex items-center justify-center gap-4">
                    <RiMessengerLine size={20} /> Messanger
                  </button> */}
                </div>

                <div className="mt-6 flex flex-wrap gap-8">
                  <p className="text-medium uppercase font-normal text-[#767676]">
                    Status :{" "}
                    {isStock ? (
                      <span className="pl-2 text-red-500 font-bold">Stock Out</span>
                    ) : (
                      <span className="pl-2 text-green-500 font-bold">
                        In Stock
                      </span>
                    )}
                  </p>
                  <p> | </p>

                  <p className="text-medium uppercase font-medium text-[#767676]">
                    Sku : {info?.sku}
                  </p>
                </div>

                {/* <div className="mt-2">
                  <p className="text-medium uppercase font-normal text-[#767676]">
                    TAGS :{" "}
                    <span className="text-medium uppercase  text-[#767676]">
                      Elegant, Ahbab
                    </span>
                  </p>
                </div> */}
              </div>
            </div>
            {/* Add to Cart and Buy Now buttons */}
            <div className="flex md:hidden">
              {showButtons && (
                <div className="fixed bottom-[3.4rem] left-0 z-40 right-0 bg-white shadow-md p-2">
                  <div className="flex justify-center items-center px-4 ">
                    <span className="font-bold text-black mr-4">Quantity:</span>
                    <button
                      onClick={() => decrement()}
                      disabled={isStock}
                      className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded-l px-3 py-2 w-10"
                    >
                      -
                    </button>
                    <input
                      className="text-black text-center w-12 border-none outline-none focus:ring-0 bg-transparent"
                      value={count}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCount(value); // Allow the user to type, and temporarily allow empty value for input
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
                      className="text-gray-500 hover:text-gray-700 border border-gray-300 rounded-r px-3 py-2 w-10"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex justify-between gap-2 mt-2">
                    <button
                      disabled={isStock}
                      onClick={addToCart}
                      className="px-4 py-3 w-full bg-white hover:bg-black hover:text-white border border-black text-black font-medium text-[10px] uppercase"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={buyNow}
                      className="px-4 py-3 bg-secondary text-white hover:bg-[#070707] border w-full font-medium text-[10px] uppercase"
                    >
                      Buy Now
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-3 base-container">
            {/* Accordion 1 - Short Description (Only visible on mobile) */}
            <div className="collapse collapse-plus border-[#99989883] border-b rounded-none group lg:hidden">
              <input
                type="checkbox"
                checked={openIndex.includes(0)}
                onChange={() => handleAccordionClick(0)}
              />
              <div className="collapse-title text-[#666666] text-sm font-normal uppercase group-hover:text-primary">
                Short Description
              </div>
              {openIndex.includes(0) && (
                <div className="collapse-content">
                  <div
                    className="text-black"
                    dangerouslySetInnerHTML={{ __html: info?.shortDescription }}
                  ></div>
                </div>
              )}
            </div>


            {/* Accordion 2 */}
            <div className="collapse collapse-plus border-[#99989883] border-y rounded-none group">
              <input
                type="checkbox"
                checked={openIndex.includes(1)}
                onChange={() => handleAccordionClick(1)}
              />
              <div className="collapse-title text-[#666666] text-sm font-normal uppercase group-hover:text-primary">
                Description
              </div>
              {openIndex.includes(1) && (
                <div className="collapse-content">
                  <div
                    className="text-black"
                    dangerouslySetInnerHTML={{ __html: info?.description }}
                  ></div>
                </div>
              )}
            </div>


            {/* Accordion 3 */}
            <div className="collapse collapse-plus border-[#99989883] border-b rounded-none group">
              <input
                type="checkbox"
                checked={openIndex.includes(2)}
                onChange={() => handleAccordionClick(2)}
              />
              <div className="collapse-title text-[#666666] text-sm font-normal uppercase group-hover:text-primary">
                Reviews
              </div>
              {openIndex.includes(2) && (
                <div className="collapse-content">
                  <p></p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Add scroll to top functionality
const ScrollToTop = () => {
  useEffect(() => {
    const handleScrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    };

    // Add event listener to router change events
    const handleRouteChange = () => {
      handleScrollToTop();
    };

    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return null;
};

export default ProductDetails2;
