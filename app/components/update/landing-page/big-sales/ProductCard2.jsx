"use client";

import encryptData from "@/app/api/encrypt";
import generateFbc from "@/app/api/fb_c";
import generateFbp from "@/app/api/fb_p";
import trackFacebookEvent from "@/app/api/fbEventTracker";
import findUserIpAddress from "@/app/api/ip";
import generateUniqueId from "@/app/api/uniqueIds";
import wishlistEncrypt from "@/app/api/wishlistEncrypt";
import { imageBasePath } from "@/config";
import { useStatus } from "@/context/contextStatus";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { getProductImage } from "@/app/utils/getProductImage";

const ProductCard2 = ({ item, combo }) => {
  const [isVariant, setIsVariant] = useState(item?.isVariant);
  const { cartItems, setCartItems, settingsData, wishlistItems, setWishlistItems } = useStatus();
  const [totalStock, setTotalStock] = useState(item?.nonVariation?.stock);
  const [count, setCount] = useState(1);


  const router = useRouter();

  // Function to get price details based on the variant state
  const getPriceDetails = () => {
    const priceData =
      isVariant && item?.variations?.length > 0
        ? item?.variations[0]
        : item?.nonVariation;

    // Fallback values to prevent undefined
    const sellingPrice = priceData?.sellingPrice || 0;
    const regularPrice = priceData?.regularPrice || 0;

    return {
      sellingPrice,
      regularPrice,
    };
  };

  const { sellingPrice, regularPrice } = getPriceDetails();

  // Check if there are multiple images in the gallery
  // const hasMultipleImages = item?.galleryImage?.length > 1;

  const getDiscountInfo = (item) => {
    if (item?.isVariant) {
      const discount = item?.variations[0]?.discount;
      return discount?.amount !== 0
        ? { amount: discount?.amount, type: discount?.discountType }
        : null;
    } else {
      const discount = item?.nonVariation?.discount;
      return discount?.amount !== 0
        ? { amount: discount?.amount, type: discount?.discountType }
        : null;
    }
  };

  const discountInfo = getDiscountInfo(item);

  const addToCart = async () => {
    // if (isStock) {
    //   toast.warning("Stock Out !");
    //   return;
    // }

    let increaseCart = {
      productId: item?._id,
      name: item?.name,
      image: item?.galleryImage,
      price: item?.isFlashDeal
        ? item?.nonVariation?.flashPrice
        : item?.nonVariation?.sellingPrice,
      isVariant: item?.isVariant,
      quantity: 1,
      // variation: selectedVariation,
      // variationId: selectedVariation?._id,
      stock: item?.nonVariation?.stock,
      slug: item?.slug,
      sku: item?.sku,
      category: item?.categories?.length ? item?.categories[0]?.name : "",
    };

    const e_commerce = {
      currency: "BDT",
      items: [
        {
          item_id: item?.sku,
          item_name: item?.name,
          item_brand: item?.brand?.name || "",
          item_category: item?.categories?.length ? item?.categories[0] : "",
          // item_variant: selectedVariation,
          price: item?.isFlashDeal
            ? item?.nonVariation?.flashPrice
            : item?.nonVariation?.sellingPrice,
          quantity: 1,
        },
      ],
    };

    const is_exist = cartItems.find(
      (variation) => variation?.productId == increaseCart?.productId
    );

    if (is_exist) {
      const updatedCart = cartItems.map((product) => {
        if (product?.productId === is_exist.productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartItems(updatedCart);
      encryptData(updatedCart);
      // localStorage.setItem("myCartMain", JSON.stringify(cartItems));

      callDataLayer("add_to_cart", e_commerce);
      fbAddToCartEvent("AddToCart", e_commerce);
      toast.success("Success! Item Added to Cart");
    }

    if (is_exist === undefined) {
      setCartItems((cartItems) => [...cartItems, increaseCart]);
      encryptData([...cartItems, increaseCart]);
      // localStorage.setItem("myCartMain", JSON.stringify([...cartItems, item]));

      callDataLayer("add_to_cart", e_commerce);
      fbAddToCartEvent("AddToCart", e_commerce);
      toast.success("Success! Item Added to Cart");
    }
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

  // buy now function to direct checkout
  const buyNow = async () => {
    if (combo) {
      router.push(`/comboProduct/${item?.slug}`);
    } else {
      if (item?.isVariant) {
        router.push(`/product/${item?.slug}`);
      } else {
        if (totalStock >= count) {
          setCount(1);
          let product = {
            productId: item?._id, // Use a different name for this object, like 'product'
            name: item?.name,
            image: item?.galleryImage,
            price: item?.isFlashDeal
              ? item?.nonVariation?.flashPrice
              : item?.nonVariation?.sellingPrice,
            isVariant: item?.isVariant,
            quantity: count,
            variation: null,
            stock: totalStock,
            slug: item?.slug,
            sku: item?.sku,
            category: item?.categories?.length ? item?.categories[0]?.name : "",
          };

          const e_commerce = {
            currency: "BDT",
            items: [
              {
                item_id: product?.sku,
                item_name: product?.name,
                item_brand: item?.brand?.name || "",
                item_category: item?.categories?.length
                  ? item?.categories[0]
                  : "",
                price: item?.isFlashDeal
                  ? item?.nonVariation?.flashPrice
                  : item?.nonVariation?.sellingPrice,
                quantity: count,
              },
            ],
          };

          const is_exist = cartItems.find(
            (variation) => variation?.productId == product?.productId
          );

          if (is_exist) {
            const index = cartItems.findIndex(
              (variation) => variation?.productId == is_exist?.productId
            );
            cartItems[index].quantity += count;
            setCartItems(cartItems);

            encryptData(cartItems);

            callDataLayer("buy_now", e_commerce);
            router.push("/checkout");
          }

          if (is_exist === undefined) {
            setCartItems((cartItems) => [...cartItems, product]);

            encryptData([...cartItems, product]);
            callDataLayer("buy_now", e_commerce);
            router.push("/checkout");
          }
        } else {
          toast.warning("Warning! Out Of Stock");
        }
      }
    }
  };

  // wishlist 
  const wishList = async (item) => {

    if (item?.isVariant) {
      router.push(`/product/${item?.slug}`);
    } else {
      item = {
        productId: item?._id,
        name: item?.name,
        image: item?.galleryImage,
        price: item?.isFlashDeal
          ? item?.nonVariation?.flashPrice
          : item?.nonVariation?.sellingPrice,
        isVariant: item?.isVariant,
        old_price: item?.isFlashDeal
          ? item?.nonVariation?.regularPrice
          : item?.nonVariation?.regularPrice,
        quantity: 1,
        variation: "",
        variationId: "",
        stock: '',
        slug: item?.slug,
        sku: item?.sku,
        // category: item?.categories?.length ? item?.categories[0]?.name : "",
      };
    }


    const updatedWishlist = [...wishlistItems, item];
    setWishlistItems(updatedWishlist);
    wishlistEncrypt(updatedWishlist);

    toast.success("Success! Item Added to Wishlist");
  }

  // variation price 
  const getStockStatus = (item) => {
    if (item?.isVariant) {
      return item.variations.some((variation) => variation.stock > 0)
    } else {
      return item?.nonVariation?.stock > 0
    }
  }

  // Example usage
  const stockStatus = getStockStatus(item)

  const handleProductClick = () => {
    // Save current scroll position to sessionStorage before navigation
    sessionStorage.setItem('scrollPosition', window.scrollY.toString());
    router.push(`/product/${item.slug}`);
  };

  return (
    <div className="shadow group hover:shadow-none border hover:border hover:border-primary bg-white relative">
      <div className="absolute top-2 left-2 z-30 cursor-pointer"
        onClick={() => wishList(item)}
      >
        <i className="text-lg text-[#EB7F25] ri-heart-3-line"></i>
        {/* <p className="absolute -top-1 -right-2 bg-[#FC5F49] h-4 w-4 rounded-full text-center text-[12px] text-white">
          {wishlistItems?.length || 0}
        </p> */}
      </div>
      <Link href={`/product/${item?.slug}`} key={item?.id}>
        <div className="relative">
          <div className="w-full h-auto aspect-[1/1] image-zoom2 p-[10px] ">
            <img
              src={getProductImage(item)}
              alt={item?.name || "Product"}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = "/image/placeholder_600x.webp";
              }}
            />
          </div>
          {/* <div className="absolute top-2 right-0">
            {!item?.isVariant && item?.nonVariation?.stock < 1 && (
              <div className="bg-[#666666] text-white text-[10px] md:text-sm py-1 px-2 ">
                Out of Stock
              </div>
            )}
          </div> */}
          {/* <i className="text-lg ri-heart-3-line"></i> */}
          {/* <div className="absolute top-2 left-2">
            <div className="bg-[#666666] text-white text-[10px] md:text-sm py-1 px-2 ">
               <i className="text-lg ri-heart-3-line"></i> 
              </div>
          </div> */}
        </div>
      </Link>

      <Link href={`/product/${item?.slug}`} className="my-4 mx-2 ">
        <div>
          <p className="text-[#000000] text-center  font-normal mt-2 text-sm xl:text-base line-clamp-1 ">
            {item?.name}
          </p>

          {/* Price Section */}
          <div className="flex justify-center items-center gap-2 lg:mt-1">
            {regularPrice > sellingPrice && (
              <p className="text-red-600 line-through text-sm">
                TK {regularPrice}
              </p>
            )}

            <p className="text-[#000000] font-semibold text-[15px]">
              TK {sellingPrice}
            </p>
          </div>
        </div>
      </Link>

      <div className="w-full pb-4 px-6">
        {/* Stock and Variant Conditions */}
        {!stockStatus ? (
          <button className="bg-[#972222] text-white py-2 font-medium text-sm w-full rounded-lg">
            Out of Stock
          </button>
        ) : (
          <div className="bg-primary w-full rounded-lg">
            {item?.isVariant ? (
              <Link
                href={`/product/${item?.slug}`}
                className="text-white py-2 font-medium text-sm w-full block text-center "
              >
                Add to Cart
              </Link>
            ) : (
              <button
                onClick={addToCart}
                className="text-white py-2 font-medium text-sm w-full"
              >
                Add to Cart
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard2;
