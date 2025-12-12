"use client"
import axios from 'axios';
import React, { use, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use 'next/router' if using older Next.js
import ProductCard2 from '@/app/components/update/landing-page/big-sales/ProductCard2';
import Custom404 from '@/app/components/Custom404';
import { hostname, imageBasePath } from '@/config';
import { getProductImage } from '@/app/utils/getProductImage';

const BrandProduct = () => {
    const router = useRouter();
    const brand = window.location.pathname.split("/").pop();

    const [brandsList, setBrandsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [brandData, setBrandData] = useState(null);

    useEffect(() => {
        setBrandData(brand);
    }, [brand]);

    const fetchBrands = async (page = 1) => {
        try {
            setLoadingMore(page > 1);
            const response = await axios.get(`${hostname}/api/v1/product/admin-customer/productBy-brand/${brand}?page=${page}&limit=100`);

            if (page === 1) {
                setBrandsList(response.data);
                // Debug: Log first product image URL (temporary)
                if (response.data?.data?.[0]) {
                    const firstProduct = response.data.data[0];
                    const imageUrl = getProductImage(firstProduct);
                    console.log('🔍 DEBUG - First product image URL:', imageUrl);
                    console.log('🔍 DEBUG - Product data:', {
                        galleryImage: firstProduct?.galleryImage,
                        image: firstProduct?.image,
                        thumbImage: firstProduct?.thumbImage,
                        images: firstProduct?.images
                    });
                }
            } else {
                // Append new products to existing list
                setBrandsList(prevState => ({
                    ...prevState,
                    data: [...prevState.data, ...response.data.data]
                }));
            }

            // Check if there are more products to load
            if (response.data?.metaData?.totalData <= response.data?.metaData?.limit ||
                response.data?.data?.length === 0) {
                setHasMore(false);
            }
        } catch (err) {
            setError('Failed to fetch brands');
            console.error(err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        if (brandData) {
            fetchBrands(1);
        }
    }, [brandData]);

    const loadMoreProducts = () => {
        const nextPage = currentPage + 1;
        setCurrentPage(nextPage);
        fetchBrands(nextPage);
    };


    return (
        <div className='base-container py-4'>
            {brandsList?.data?.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 lg:gap-7">
                        {brandsList?.data?.map((item, index) => (
                            <div key={item._id || index}>
                                <ProductCard2 item={item} />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center mt-3 pb-3">
                        {hasMore ? (
                            <button
                                onClick={loadMoreProducts}
                                className="bg-black text-white px-3 py-2 text-[13px] rounded-md"
                                disabled={loadingMore}
                            >
                                {loadingMore ? "Loading..." : "See More"}
                            </button>
                        ) : null}
                    </div>
                </>
            ) : (
                <>
                    {loading ? (
                        <div className="flex justify-center items-center h-60">
                            <p>Loading products...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 max-h-96 text-center">
                            <img
                                src="/image/no_product.jpg"
                                alt="No Products Found"
                                className="w-32 h-32 mb-4"
                            />
                            <p className="text-gray-500 text-lg font-medium">
                                No products available for this brand.
                            </p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default BrandProduct;
