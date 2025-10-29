import React from "react";
import request from "@/lib/request";

export const getCategoryWisePro = async (slug,page, limit) => {
  try {
    let res = await request(
      `product/admin-customer/productBy-category/${slug}?page=${page}&limit=${limit}`,
      {
        next: {
          revalidate: 1,
        },
      }
    );

    if (res) {
      return res;
    }
  } catch (error) {
    console.log("err in get cat wise Products", error);
  }
};
