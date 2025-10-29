"use client";

import request from "@/lib/request";
import { useEffect, useState } from "react";
import Custom404 from "../Custom404";
import ProductCard2 from "../update/landing-page/big-sales/ProductCard2";

const ProductSection = ({ item, totalData, apititle }) => {
  const [offset, setOffset] = useState(1);
  const [productInfo, setProductInfo] = useState({});
  const [totalProducts, setTotalProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (item) {
      setTotalProducts(item);
      setLoading(false);
    }
  }, [item]);

  const loadMoreProducts = async () => {
    setLoading(true);
    try {
      const res = await request(
        `product/admin-customer/${apititle}?page=${offset + 1}&limit=100`
      );

      if (res?.data?.success) {
        setProductInfo(res.data);
        setTotalProducts([...totalProducts, ...(res.data?.data || [])]);
        setOffset(offset + 1);
      }
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      {/* Loader */}
      {loading && (
        <div className="flex justify-center items-center my-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
        </div>
      )}

      {totalProducts?.length > 0 ? (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-7">
            {totalProducts?.map((catitem, index) => (
              <div key={index}>
                <ProductCard2 item={catitem} />
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-3 pb-3">
            {totalData <= totalProducts?.length ? null : (
              <button
                onClick={loadMoreProducts}
                className="bg-black text-white px-3 py-2 text-[13px] rounded-md"
                disabled={loading}
              >
                {loading ? "Loading..." : "See More"}
              </button>
            )}
          </div>
        </>
      ) : (
        <Custom404 />
      )}
    </div>
  );
};

export default ProductSection;
