import React from "react";
import ProductCard from "../ProductCard";


const RelatedProduct = ({ products }) => {
  return (
    <div>
      <p className="uppercase tracking-widest text-center font-extrabold text-2xl py-6">
        Related Products
      </p>

      <div className="grid grid-cols-5 lg:grid-cols-4 sm:grid-cols-3 xls:grid-cols-2 xms:grid-cols-2 xs:grid-cols-2  gap-6  ">
        {products?.map((item, index) => (
          <div key={index}>
            <ProductCard productDetails={item} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProduct;
