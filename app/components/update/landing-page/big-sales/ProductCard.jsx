"use client";

import encryptData from "@/app/api/encrypt";
import generateFbc from "@/app/api/fb_c";
import generateFbp from "@/app/api/fb_p";
import trackFacebookEvent from "@/app/api/fbEventTracker";
import findUserIpAddress from "@/app/api/ip";
import generateUniqueId from "@/app/api/uniqueIds";
import { imageBasePath } from "@/config";
import { useStatus } from "@/context/contextStatus";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const ProductCard = ({ item, combo }) => {
  const [isVariant, setIsVariant] = useState(item?.isVariant);
  const { cartItems, setCartItems, settingsData } = useStatus();
  const [totalStock, setTotalStock] = useState(item?.nonVariation?.stock);
  const [count, setCount] = useState(1);

  const router = useRouter();

  // Function to get price details based on the variant state
  const getPriceDetails = () => {
    const priceData = isVariant ? item?.variations?.[0] : item?.nonVariation;
    return {
      sellingPrice: priceData?.sellingPrice,
      regularPrice: priceData?.regularPrice,
    };
  };

  const { sellingPrice, regularPrice } = getPriceDetails();

  // Check if there are multiple images in the gallery
  const hasMultipleImages = item?.galleryImage?.length > 1;

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


  return (
    <div className="border border-[#c6c5c5] hover:border-[#767575] ">
      <div key={item?.id} className="relative ">
        <Link href={`/product/${item?.slug}`} className="relative group">
          <div className="w-full h-[300px] md:h-[450px]">
            <Image
              src={`${imageBasePath}/${item?.galleryImage?.[0]}`}
              alt={item?.title}
              width={0}
              height={0}
              sizes={100}
              className="w-full h-[300px] md:h-[450px] object-cover"
            />
          </div>

          {hasMultipleImages && (
            <div className="absolute top-0 left-0 w-full h-full">
              <Image
                src={`${imageBasePath}/${item?.galleryImage?.[1]}`}
                alt={item?.title}
                width={0}
                height={0}
                sizes={100}
                className="w-full h-[300px] md:h-[450px] object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          )}

          <div className="absolute top-2 right-2">
            {/* <p className="text-[12px] bg-gradient-to-r from-[#DA1C5C] to-[#551313] text-white py-1 px-[10px] rounded-full shadow-lg animate-bounce">
              13% OFF
            </p> */}
            {discountInfo && (
              <p className="text-[12px] bg-black text-white font-bold py-1 px-[10px] rounded shadow-lg animate-bounce">
                {discountInfo.amount}
                {discountInfo.type === "FLAT" ? " flat" : "% off"}
              </p>
            )}
          </div>
        </Link>

        <div className="my-4 mx-2 ">
          <Link href={`/product/৳{item?.slug}`}>
            {/* <p className="text-[12px] text-[#696868]">{item?.category}</p> */}

            <p className="text-[#070707] mt-2 text-sm line-clamp-1 ">
              {item?.name}
            </p>

            {/* Price Section */}
            {/* Price Section */}
            <div className="flex items-center gap-2 mt-2">
              <p className="text-[#696868] font-semibold text-sm">
                ৳{sellingPrice}
              </p>
              {regularPrice > sellingPrice && regularPrice > 0 && (
                <p className="text-[#696868] line-through text-[10px]">
                  ৳{regularPrice}
                </p>
              )}
            </div>
          </Link>

          {!item?.isVariant ? (
            <div>
              {item?.nonVariation?.stock > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 md:gap-2">
                  <button
                    onClick={() => addToCart()}
                    className="bg-[#F0F0F0] hover:bg-black hover:text-white shadow-md text-[#070707] font-bold py-3 !px-2 md:!px-4 uppercase text-[10px] md:text-[12px] mt-2"
                  >
                    Add to cart
                  </button>
                  <button
                    onClick={() => buyNow()}
                    className="button hover:bg-[#FC5F49] !py-3 !px-2 md:!px-4 !text-[10px] !md:text-[14px] mt-2"
                  >
                    Buy now
                  </button>
                </div>
              ) : (
                <button className="w-full text-white font-bold rounded bg-[#ff0707] !py-3  !text-[10px] md:!text-[12px] lg:!text-base mt-2">
                  Out of Stock
                </button>
              )}
            </div>
          ) : (
            <Link
              href={`/product/${item?.slug}`}
              className="grid grid-cols-1 md:grid-cols-2 md:gap-2"
            >
              <button className="bg-[#F0F0F0] hover:bg-black hover:text-white shadow-md border-[#cbc8c8] font-bold text-[#070707] py-3 !px-2  md:!px-4 uppercase text-[10px] md:text-[12px] mt-2">
                Add to cart
              </button>
              <button className="button hover:bg-[#FC5F49]  !py-3 !px-2  md:!px-4  !text-[10px] !md:text-[12px] mt-2">
                Buy now
              </button>
            </Link>
          )}

          {/* <div className="grid grid-cols-2 gap-2">
            <button className="button hover:bg-[#FC5F49]  !py-3 !px-2  md:!px-4  !text-[10px] !md:text-[12px] mt-2">
              Add to cart
            </button>
            <button className="bg-[#F0F0F0] text-[#070707] py-3 !px-2  md:!px-4 uppercase text-[10px] md:text-[12px] mt-2">
              Buy now
            </button>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
