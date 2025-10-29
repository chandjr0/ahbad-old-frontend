"use client"

export const generateFbclid = (length = 22) => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let fbclid = "";
    for (let i = 0; i < length; i++) {
      fbclid += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return fbclid;
  };
  
  