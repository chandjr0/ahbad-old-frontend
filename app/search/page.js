"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard2 from '@/app/components/update/landing-page/big-sales/ProductCard2';
import postRequest from '@/lib/postRequest';
import { FiSearch } from "react-icons/fi";

const SearchResults = () => {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  const [searchInProgress, setSearchInProgress] = useState(false);

  // Breadcrumbs for navigation
  const breadCumbs = [
    { name: "Home", url: "/" },
    { name: "Search Results" }
  ];
  

  // Function to fetch search results
  const fetchSearchResults = async (page = 1) => {
    if (!searchQuery.trim()) {
      setLoading(false);
      return;
    }

    try {
      setSearchInProgress(true);
      setLoadingMore(page > 1);
      
      const data = {
        value: searchQuery
      };
      
      const res = await postRequest(
        `product/admin-customer/search?page=${page}&limit=30`,
        data
      );
      
      if (res?.success) {
        if (page === 1) {
          setProducts(res.data || []);
        } else {
          setProducts(prevProducts => [...prevProducts, ...(res.data || [])]);
        }
        
        // Update total results count if available
        if (res.metaData && res.metaData.totalData) {
          setTotalResults(res.metaData.totalData);
        }
        
        // Check if there are more results to load
        const hasMoreResults = 
          (res.data && res.data.length === 30) && 
          (res.metaData && page < res.metaData.totalPage);
        
        setHasMore(hasMoreResults);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setSearchInProgress(false);
    }
  };


  // Load more results when the "See More" button is clicked
  const loadMoreResults = () => {
    if (searchInProgress) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    fetchSearchResults(nextPage);
  };

  // Fetch results when the search query changes
  useEffect(() => {
    setCurrentPage(1);
    setProducts([]);
    setLoading(true);
    setHasMore(true);
    fetchSearchResults(1);
  }, [searchQuery]);

  return (
    <div className="bg-white text-black min-h-screen">
      
      <div className="base-container py-8">
        <h1 className="text-2xl font-bold mb-6">
          {searchQuery && `Search Results for ${searchQuery}`}
        </h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : products.length > 0 ? (
          <>
            <p className="text-gray-600 mb-4">
              {totalResults > 0 ? `Found ${totalResults} products matching ${searchQuery}` : ''}
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
              {products.map((product, index) => (
                <div key={product._id || index} className="transition-all duration-300 hover:shadow-lg">
                  <ProductCard2 item={product} />
                </div>
              ))}
            </div>
            
            {hasMore && (
              <div className="flex justify-center mt-10">
                <button
                  onClick={loadMoreResults}
                  className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-md transition duration-300"
                  disabled={loadingMore || searchInProgress}
                >
                  {loadingMore ? (
                    <span className="flex items-center">
                      <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-b-2 border-white rounded-full"></span>
                      Loading more products...
                    </span>
                  ) : 'See More Products'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="mb-6">
              <FiSearch className="w-16 h-16 mx-auto text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults; 