import React,{useState} from 'react'
import { useStatus } from '@/context/contextStatus';
const CouponSection = ({applyPromo,promoCode,setPromoCode}) => {

  //  const {promoCode,setPromoCode} = useStatus()
 

  return (
    <div>
      <div className="flex mt-4 ">
        <div className="w-full">
          <input
            type="text"
            className="rounded-l-md h-10 w-full  px-3 bg-gray-100 outline-none placeholder:text-sm placeholder:text-gray-400"
            placeholder="If you have a Promo Code, Enter Here..."
            onChange={(e)=>setPromoCode(e.target.value)}
            value={promoCode}
          />
        </div>
        <div>
          <button
            className="bg-secondary px-4 h-10 text-white font-semibold tracking-wide text-sm rounded-tr-md rounded-br-md"
            onClick={()=>{
              applyPromo(promoCode)
            }}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default CouponSection