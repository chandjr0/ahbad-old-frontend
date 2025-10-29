//counterSlice.jsx

"use client"; //this is a client side component

import { createSlice } from "@reduxjs/toolkit";
import { parseCookies } from 'nookies';
const cookies = parseCookies();

const myCookieValue = cookies;

// console.log('................cookies......', JSON.parse(myCookieValue.myCartMain));
const initialState = {
  value: myCookieValue?.myWishList ? JSON.parse(myCookieValue.myWishList) :  [],
};

export const wishListSlice = createSlice({
  name: "redux_wishlist",
  initialState,
  reducers: {
  
    WISH_LIST: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.value?.find(
        (item) => item.productId === newItem.productId
      );

      if (existingItem) {
        // existingItem.quantity += newItem.quantity;
      } else {
        state.value.push(newItem);
      }
    },
   
  },
});

export const { WISH_LIST } = wishListSlice.actions;

export default wishListSlice.reducer;
