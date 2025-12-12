import React from "react";
import request from "@/lib/request";

export const getCategoryWisePro = async (slug, page, limit) => {
  try {
    let res = await request(
      `product/admin-customer/productBy-category/${slug}?page=${page}&limit=${limit}`
    );

    // Handle 304 Not Modified (axios returns response with status 304)
    if (res) {
      return res;
    }
    
    // Return empty structure if no response
    return {
      data: {
        data: [],
        metaData: { totalData: 0 },
        categoriesInfo: null
      }
    };
  } catch (error) {
    // Return empty structure on error instead of undefined
    return {
      data: {
        data: [],
        metaData: { totalData: 0 },
        categoriesInfo: null
      }
    };
  }
};
