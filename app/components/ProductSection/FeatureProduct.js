import React from 'react'
import ProductCard from '../ProductCard';
import Link from 'next/link';

const FeatureProduct = ({ FeatureProd }) => {

 
  return (
    <div>
      <div className="flex justify-between items-center py-3">
        <p className="uppercase tracking-widest font-extrabold text-2xl xls:text-lg xms:text-lg xs:text-lg">
          Feature product
        </p>

        <Link
          href="/feature-products"
          className="px-3 py-1 text-white text-sm bg-secondary"
        >
          See all
        </Link>
      </div>
      <div className="grid grid-cols-5 lg:grid-cols-4 md:grid-cols-4 sm:grid-cols-3 xls:grid-cols-2 xms:grid-cols-2 xs:grid-cols-2 gap-6 md:gap-4 sm:gap-3 xls:gap-2 xms:gap-2 xs:gap-2">
        {FeatureProd?.map((item, index) => (
          <div key={index}>
            <ProductCard productDetails={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureProduct