/** @type {import('tailwindcss').Config} */
const {nextui} = require("@nextui-org/react");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        myShadow1: "5px -5px 0 0 #fff",
        myShadow2: "-5px -5px 0 0 #fff",
      },
      colors: {
        primary: "#0E0F51",
        secondary: "#070707",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    // screens: {
    //   xs: { min: "270px", max: "320px" },
    //   xms: { min: "321px", max: "375px" },
    //   xls: { min: "376px", max: "480px" },
    //   // => @media (min-width: 320px) { ... }

    //   sm: { min: "481px", max: "768px" },
    //   // => @media (min-width: 640px) { ... }
    //   md: { min: "769px", max: "1024px" },
    //   // => @media (min-width: 768px) { ... }

    //   lg: { min: "1025px", max: "1440px" },

    //   // => @media (min-width: 1024px) { ... }
    //   xl: { min: "1441px", max: "2500px" },
    //   // => @media (min-width: 1280px) { ... }
    //   xxl: { min: "2500px", max: "2561px" },
    // },
  },
  plugins: [nextui(), 
    require('daisyui')
  ],
};