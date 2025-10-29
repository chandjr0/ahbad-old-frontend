import React from 'react'
import BillingDetails from './BillingDetails'
import ProductCart from './ProductCart'

const Checkout = () => {
  return (
    <div className='base-container global-top'>
          <section className='border-2 border-[#D1D5DB] rounded-md py-8 '>
              <p className='text-center text-2xl font-semibold text-[#070707]'>Checkout Page</p>

              <div className=' mx-4 lg:mx-12 grid grid-cols-1 lg:grid-cols-2 gap-20 my-8'>
                <BillingDetails />
                <ProductCart />
              </div>

          </section>
      </div>
  )
}

export default Checkout