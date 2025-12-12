"use client";

import { imageBasePath } from "@/config";
import { useStatus } from "@/context/contextStatus";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import encryptData from "../api/encrypt";
import PlaceHolderImg from "@/public/image/placeholder_600x.webp";
import { getProductImage, resolveImageUrl } from "@/app/utils/getProductImage";


const ProductCard = ({ productDetails, params, combo }) => {
  const router = useRouter();
  const { cartItems, setCartItems } = useStatus();
  const [count, setCount] = useState(1);
  const [totalStock, setTotalStock] = useState(0);

  // buy now function to direct checkout
  const buyNow = async () => {
    if (combo) {
      router.push(`/comboProduct/${productDetails?.slug}`);
    } else {
      if (productDetails?.isVariant) {
        router.push(`/product/${productDetails?.slug}`);
      } else {
        if (totalStock >= count) {
          setCount(1);
          let item = {
            productId: productDetails?._id,
            name: productDetails?.name,
            image: productDetails?.galleryImage,
            price: productDetails?.isFlashDeal
              ? productDetails?.nonVariation?.flashPrice
              : productDetails?.nonVariation?.sellingPrice,
            isVariant: productDetails?.isVariant,
            quantity: count,
            variation: null,
            stock: totalStock,
            slug: productDetails?.slug,
            sku: productDetails?.sku,
            category: productDetails?.categories?.length
              ? productDetails?.categories[0]?.name
              : "",
          };

          const e_commerce = {
            currency: "BDT",
            items: [
              {
                item_id: productDetails?.sku,
                item_name: productDetails?.name,
                item_brand: productDetails?.brand?.name || "",
                item_category: productDetails?.categories?.length
                  ? productDetails?.categories[0]
                  : "",
                price: productDetails?.isFlashDeal
                  ? productDetails?.nonVariation?.flashPrice
                  : productDetails?.nonVariation?.sellingPrice,
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

            // localStorage.setItem("myCartMain", JSON.stringify(cartItems));
            encryptData(cartItems);

            callDataLayer("buy_now", e_commerce);
            router.push("/checkout");
          }

          if (is_exist === undefined) {
            setCartItems((cartItems) => [...cartItems, item]);

            // localStorage.setItem("myCartMain", JSON.stringify([...cartItems, item]));
            encryptData([...cartItems, item]);
            callDataLayer("buy_now", e_commerce);
            router.push("/checkout");
          }
        } else {
          toast.warning("Warning! Out Of Stock");
        }
      }
    }
  };

  useEffect(() => {
    setTotalStock(productDetails?.nonVariation?.stock);
  }, [productDetails]);

  const callDataLayer = (eventName, e_commerce) => {
    window.dataLayer = window.dataLayer || [];
    dataLayer.push({
      event: eventName,
      e_commerce,
    });
  };

  return (
    <div className="group relative border border-gray-300 hover:border-secondary duration-300">
      <Link
        href={
          combo
            ? params?.searchParams?.fbclid
              ? `/comboProduct/${productDetails?.slug}?fbclid=${params?.searchParams?.fbclid}`
              : `/comboProduct/${productDetails?.slug}`
            : params?.searchParams?.fbclid
            ? `/product/${productDetails?.slug}?fbclid=${params?.searchParams?.fbclid}`
            : `/product/${productDetails?.slug}`
        }
      >
        {productDetails?.galleryImage?.length > 1 ? (
          <>
            <div className="cursor-pointer group-hover:hidden block">
              <img
                src={getProductImage(productDetails)}
                alt={productDetails?.name || "Product"}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "/image/placeholder_600x.webp";
                }}
              />
            </div>
            <div className="cursor-pointer hidden group-hover:block">
              <img
                src={resolveImageUrl(productDetails?.galleryImage?.[1])}
                alt={productDetails?.name || "Product"}
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.src = "/image/placeholder_600x.webp";
                }}
              />
            </div>
          </>
        ) : (
          <div className="cursor-pointer">
            <img
              src={getProductImage(productDetails)}
              alt={productDetails?.name || "Product"}
              className="w-full h-full object-contain"
              onError={(e) => {
                e.target.src = "/image/placeholder_600x.webp";
              }}
            />
          </div>
        )}
      </Link>
      {productDetails?.isVariant ? (
        <>
          {productDetails?.variations[0]?.discount?.amount !== 0 ? (
            <>
              <button className="absolute top-2 bg-[#DA1C5C] text-white text-xs px-2 py-1">
                {productDetails?.variations[0]?.discount?.amount}
                {productDetails?.variations[0]?.discount?.discountType == "FLAT"
                  ? "FLAT"
                  : "%"}
              </button>
            </>
          ) : null}
        </>
      ) : (
        <>
          {productDetails?.nonVariation?.discount?.amount !== 0 ? (
            <button className="absolute top-2 bg-[#DA1C5C] text-white text-xs px-2 py-1">
              {productDetails?.nonVariation?.discount?.amount}{" "}
              {productDetails?.nonVariation?.discount?.discountType == "FLAT"
                ? "FLAT"
                : "%"}
            </button>
          ) : null}
        </>
      )}
      <div className="mt-3 p-2">
        {productDetails?.name?.length > 45 ? (
          <p className="text-sm xls:text-xs xms:text-xs xs:text-xs h-[40px] text-center">
            {productDetails?.name.substring(0, 45) + "...."}
          </p>
        ) : (
          <p className="text-sm xls:text-xs xms:text-xs xs:text-xs h-[40px] text-center">
            {productDetails?.name}
          </p>
        )}

        {/* <div>
          <p className="text-sm xls:text-xs xms:text-xs xs:text-xs">
            Sku: <span className="font-extrabold">{productDetails?.sku}</span>
          </p>
        </div> */}
        {combo ? (
          <div className="flex items-center justify-center space-x-2">
            <p className="font-extrabold text-sm xls:text-xs xms:text-xs xs:text-xs">
              TK. {productDetails?.sellingPrice}
            </p>
            <p className="text-gray-300 text-sm xls:text-xs xms:text-xs xs:text-xs line-through">
              {productDetails?.regularPrice}
            </p>
          </div>
        ) : (
          <div className="flex items-center justify-center space-x-2">
            <p className="font-extrabold text-sm xls:text-xs xms:text-xs xs:text-xs">
              TK.{" "}
              {productDetails?.isVariant
                ? productDetails?.variations[0]?.sellingPrice
                : productDetails?.nonVariation?.sellingPrice}
            </p>
            <p className="text-gray-300 text-sm xls:text-xs xms:text-xs xs:text-xs line-through">
              {productDetails?.isVariant
                ? productDetails?.variations[0]?.regularPrice >
                  productDetails?.variations[0]?.sellingPrice
                  ? `TK. ${productDetails?.variations[0]?.regularPrice}`
                  : ""
                : productDetails?.nonVariation?.regularPrice >
                  productDetails?.nonVariation?.sellingPrice
                ? `TK. ${productDetails?.nonVariation?.regularPrice}`
                : ""}
            </p>
          </div>
        )}
      </div>
      <div className="w-full flex xms:block xs:block justify-between space-x-2 xms:space-x-0 xs:space-x-0">
        {productDetails?.isVariant == false &&
        productDetails?.nonVariation?.stock == 0 ? (
          <div className="w-full px-3">
            <button className="bg-[#F8D7DA] text-secondary w-full rounded-full  py-1   mb-2 text-sm capitalize cursor-text font-semibold xms:mt-2 xs:mt-2">
              Stock out
            </button>
          </div>
        ) : (
          <button
            className="bg-secondary text-white w-full py-2 text-sm capitalize font-semibold xms:mt-2 xs:mt-2"
            onClick={() => buyNow()}
            id="product_view"
          >
            buy now
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
