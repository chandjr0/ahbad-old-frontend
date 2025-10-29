"use client"

import { useStatus } from '@/context/contextStatus';
import { useRouter } from 'next/navigation';
import React from 'react'
import { BsCart3 } from 'react-icons/bs';
import { toast } from 'react-toastify';



const CartCompo = () => {
 
    const router = useRouter();

    const {cartItems} = useStatus();


  return (
  
        
        <div
          className="cursor-pointer relative top-[0px] ms-3 me-4"
          onClick={() => {
            cartItems?.length > 0
              ? router.push(`/checkout`)
              : toast.warning("Cart is Empty");
          }}
        >
          <div className="absolute top-[-13px] right-[-8px] bg-secondary h-[20px] w-[20px] rounded-full flex justify-center items-center">
            <p className="text-white text-xs">{cartItems?.length}</p>
          </div>
          <BsCart3 className="text-secondary" size={22} />
        </div>
     
  );
}

export default CartCompo