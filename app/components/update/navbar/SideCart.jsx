import encryptData from "@/app/api/encrypt";
import { imageBasePath } from "@/config";
import { useStatus } from "@/context/contextStatus";
import postRequest from "@/lib/postRequest";
import Image from "next/image";
import React, { useState } from "react";

const SideCart = () => {
  const { cartItems, setCartItems } = useStatus();
  const [renderMe, setRenderMe] = useState(false);


  const increment = async (index, stock, qty, item) => {
    if (item?.isCombo) {
      const updatedCartItems = [...cartItems]; // Create a new array
      updatedCartItems[index].quantity += 1;
      setCartItems(updatedCartItems); // Update the state with the new array
      encryptData(updatedCartItems);
      setRenderMe(!renderMe); // Force re-render
    } else {
      const obj = {
        variationId: cartItems[index]?.variationId || "",
        productId: cartItems[index]?.productId,
      };

      try {
        let res = await postRequest(`product/admin-customer/check-product-stock`, obj);
        if (res && res?.data?.stock > qty) {
          const updatedCartItems = [...cartItems];
          updatedCartItems[index].quantity += 1;
          setCartItems(updatedCartItems); // Update the state with the new array
          encryptData(updatedCartItems);
          setRenderMe(!renderMe); // Force re-render
        } else {
          toast.warning("Warning! No More Stock Left");
        }
      } catch (error) {
        console.log("error in stock check", error);
      }
    }
  };

  const decrement = async (index) => {
    if (cartItems[index]?.quantity > 1) {
      const updatedCartItems = [...cartItems]; // Create a new array
      updatedCartItems[index].quantity -= 1;
      setCartItems(updatedCartItems); // Update the state with the new array
      encryptData(updatedCartItems);
      setRenderMe(!renderMe); // Force re-render
    }
  };

  const removeItem = async (index) => {
    // removePromo()
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);

    if (updatedCartItems?.length == 0) {
      setCartItems([]);
      localStorage.removeItem("myCartMain");
      setRenderMe(!renderMe);
    }

    setCartItems(updatedCartItems);
    setRenderMe(!renderMe);
    encryptData(updatedCartItems);
    // setPromoCode('')
  };


  return (
    <div className="">
      <div className="mt-4">
        {cartItems?.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-4 mt-4 shadow p-2">
            <div className="col-span-12">
              <div className="flex flex-row gap-4">
                {/* <Image
                  src={`${imageBasePath}/${item?.image?.[0]}`}
                  alt="image"
                  width={0}
                  height={0}
                  sizes="100"
                  className="w-[3rem] h-16 "
                /> */}
                 {item?.isVariant ? (
                    <div className="w-[4rem] h-16">
                      <Image
                        width={0}
                        height={0}
                        src={
                          item?.variation?.images?.length
                            ? `${imageBasePath}/${item?.variation?.images[0]}`
                            : item?.image?.length
                              ? `${imageBasePath}/${item?.image[0]}`
                              : "/image/product/placeholder_600x.webp"
                        }
                        alt="product"
                        sizes="100"
                        className="w-full h-full rounded"
                      />
                    </div>
                  ) : (
                    <div className="w-[4rem] h-16">
                      <Image
                        width={0}
                        height={0}
                        src={
                          item?.image?.length
                            ? `${imageBasePath}/${item?.image[0]}`
                            : "/image/product/placeholder_600x.webp"
                        }
                        alt="product"
                        sizes="100"
                        className="w-full h-full rounded"
                      />
                    </div>
                  )}


                <div className="w-full">
                  <p className="text-[12px] font-medium text-[#4c4b4b] line-clamp-1">
                    {item?.name}
                  </p>

                  {/* show here variation list if have  */}
                  {item?.isVariant && item?.variation?.attributeOpts?.length > 0 && (
                    <div className="flex flex-wrap gap-2 my-1">
                      {item?.variation?.attributeOpts.map((opt, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-gray-100 border border-gray-300 px-2 py-[2px] rounded text-gray-700"
                        >
                          {opt?.name}
                        </span>
                      ))}
                    </div>
                  )}


                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">Tk {item?.price}</p>

                    {item?.isVariant && (
                      <p className="text-[12px] line-through text-red-400 font-semibold">
                        {item?.variation?.regularPrice}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between">
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-[12px]"> Qty </p>
                      <div className="flex items-center">
                        <p
                          onClick={() => decrement(index)}
                          className="text-sm rounded border border-[#c3c1c1] px-2 text-center cursor-pointer  "
                        >
                          -
                        </p>
                        <p className="px-2 text-sm">{item?.quantity}</p>
                        {/* <input
                          type="text"
                          className="w-[40px]  pl-3 outline-none"
                          value={item?.quantity}
                          
                        /> */}
                        <p
                          onClick={() =>
                            increment(index, item?.stock, item?.quantity, item)
                          }
                          className="text-sm rounded border border-[#c3c1c1] px-2 text-center cursor-pointer "
                        >
                          +
                        </p>
                      </div>
                    </div>
                    <div className=" cursor-pointer" onClick={() => removeItem(index)}>
                      <i className="ri-delete-bin-5-line text-red-400 font-bold"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SideCart;
