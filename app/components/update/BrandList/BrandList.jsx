'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { hostname, imageBasePath } from '@/config';
import Link from 'next/link';

const BrandList = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await axios.get(`${hostname}/api/v1/brand/fetch-all`);
                setBrands(response.data?.data);
            } catch (err) {
                setError('Failed to fetch brands');
            } finally {
                setLoading(false);
            }
        };

        fetchBrands();
    }, []);


    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500">{error}</div>;

    return (
        <div className="base-container section-gap pb-12">
            <h2 className="text-title text-center mb-10">Brand List</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4">
                {brands?.map((brand) => (
                    // <div key={brand?.id}
                    //     className="bg-white shadow-md border rounded-lg p-4 flex justify-center items-center transition-transform transform hover:scale-105"
                    // >
                    //     <img
                    //         src={`${imageBasePath}/${brand?.image}`}
                    //         alt={brand.name}
                    //         className="w-24 h-24 object-contain"
                    //     />
                    // </div>
                    <Link href={`/product-by-brand/${brand?.slug}`} key={brand?.id}
                        className="bg-white shadow-md border rounded-lg p-4 flex justify-center items-center transition-transform transform hover:scale-105"
                    >
                        <img
                            src={`${imageBasePath}/${brand?.image}`}
                            alt={brand.name}
                            className="w-24 h-24 object-contain"
                        />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default BrandList;