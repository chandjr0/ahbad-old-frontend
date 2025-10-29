//counterSlice.jsx

"use client"; //this is a client side component

import { createSlice } from "@reduxjs/toolkit";
import { parseCookies } from 'nookies';
const cookies = parseCookies();

const myCookieValue = cookies;

// console.log('................cookies......', JSON.parse(myCookieValue.myCartMain));
const initialState = {
  value: myCookieValue?.myCartMain ? JSON.parse(myCookieValue.myCartMain) :  [],
};

export const addToCartSlice = createSlice({
  name: "redux_cart",
  initialState,
  reducers: {
  
    ADD_TO_CART: (state, action) => {
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

export const { ADD_TO_CART } = addToCartSlice.actions;

export default addToCartSlice.reducer;
