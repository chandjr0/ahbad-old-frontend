"use client"

import React from 'react'
import ProductCard from '../ProductCard';
import Link from 'next/link';
import postRequest from '@/lib/postRequest';

const comboProducts = ({ combos }) => {


  return (
    <div>
      <d iv className="flex justify-between items-center py-3">
        <p className="uppercase tracking-widest font-extrabold text-2xl xls:text-lg xms:text-lg xs:text-lg">
          Combo Products
        </p>

        <Link
          href="/combo-products"
          className="px-3 py-1 text-white text-sm bg-secondary"
        >
          See all
        </Link>
      </d>
      <div className="grid grid-cols-5 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-3 xls:grid-cols-2 xms:grid-cols-2 xs:grid-cols-2 gap-6 md:gap-4 sm:gap-3 xls:gap-2 xms:gap-2 xs:gap-2">
        {combos?.map((item, index) => (
          <div key={index}>
            <ProductCard productDetails={item} combo={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default comboProducts;