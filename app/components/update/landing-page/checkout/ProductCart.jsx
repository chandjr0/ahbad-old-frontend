import Image from 'next/image'
import React from 'react'

const ProductCart = () => {
    const data = [
        {
          image: "/image/img1.jpg",
          name: "Height Adjustable Movable Laptop Desk With Storage Shelf Lazy Sofa Corner Lift Computer Desk Table 1 Layers By SHAMAHAR.",
          price: "1475",
          old_price: "2500"
        },
        {
          image: "/image/img2.jpg",
          name: " Multi- function and Removable Stand Folding Computer Laptop Desk Small Bed Desk Simple Dormitory Lazy Table Bed with Laptop Table with Holder Slot Portable Table Stand for Laptop Tablet Reading Table - cloth stand",
          price: "435",
          old_price: ""
        },
        {
          image: "/image/img3.jpg",
          name: "Desk Small Bed Desk Simple Dormitory Lazy Table Bed with Laptop Table",
          price: "1000",
          old_price: "1500"
        }
      ]
  return (
    <div>
    <p className='text-gray-600 border-dashed border-b-2 border-[#c3c1c1] inline-block text-xl font-semibold '>Product Details</p>

    <div className='mt-6'>
      <div className='flex justify-between border-dashed border-b-2 pb-2 border-[#c3c1c1]'>
        <p className='text-gray-600 text-sm font-semibold'>Product Name</p>
        <p className='text-gray-600 text-sm font-semibold'>Price</p>
      </div>

      <div className='mt-4'>
        {data?.map((item, index) => (
          <div key={index} className='grid grid-cols-12 gap-4 mt-4 shadow p-2 ' >
            <div className="col-span-8">
              <div className='flex flex-row gap-4'>
                <Image
                  src={item?.image}
                  alt="image"
                  width={0}
                  height={0}
                  sizes='100'
                  className='w-[7rem] h-24 rounded'
                />
                <div>
                  <p className='text-lg font-medium text-[#4c4b4b]  line-clamp-1'>{item.name}</p>
                  <p className='text-sm'>Delivery Charge <span className='font-semibold'>(Rate by Weight)</span> </p>
                  <div className='flex gap-2 mt-4'>
                    <p className='text-sm'> Qty </p>
                    <div className='flex items-center'>
                      <button className='border border-[#c3c1c1] px-2'>-</button>
                      <p className='px-2'>1</p>
                      <button className='border border-[#c3c1c1] px-2'>+</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-span-4'>
              <div className='flex justify-end items-center gap-2'>
                <p className='text-lg font-semibold'> <span className='text-sm '>Tk</span> {item.price}</p>
                {item.old_price && <p className='text-sm line-through text-red-400 font-semibold'>{item.old_price}</p>}
              </div>

              <div className='flex justify-end mt-4'>
                <i class="ri-delete-bin-5-line text-red-400 font-bold"></i>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className='mt-2'>
        <div className='flex justify-between border-dashed border-b-2 border-[#c3c1c1] py-1'>
          <p>Sub-Total (+)</p>
          <p className='text-xl font-semibold'> <span>Tk</span> 3000</p>
        </div>
      </div>

      <div className='mt-2'>
        <div className='flex justify-between py-1'>
          <p className='font-semibold'>Total</p>
          <p className='text-xl font-semibold'> <span>Tk</span> 3000</p>
        </div>
      </div>

      <button className='bg-[#070707] w-full py-3 text-white rounded mt-4'>
      Confirm The Order 3000 TK
      </button>
    </div>

  </div>
  )
}

export default ProductCart