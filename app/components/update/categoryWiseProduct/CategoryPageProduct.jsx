import React from "react";
import ProductCard from "../landing-page/big-sales/ProductCard";

const CategoryPageProduct = () => {
  const product = [
    {
      id: 11,
      category: "Bottega Veneta",
      title:
        "V Logo Pocket Wool & Silk Dress Pullover Sweatshirt  Pullover Sweatshirt ",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product1.1.jpg",
      hoverImg: "/image/product1.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 12,
      category: "Fendi",
      title: "Melody Fleece Pullover Sweatshirt",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product2.1.jpg",
      hoverImg: "/image/product2.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 13,
      category: "Bottega Veneta",
      title:
        "V Logo Pocket Wool & Silk Dress Pullover Sweatshirt  Pullover Sweatshirt ",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product3.1.jpg",
      hoverImg: "/image/product3.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 14,
      category: "Fendi",
      title: "Melody Fleece Pullover Sweatshirt",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product4.1.jpg",
      hoverImg: "/image/product4.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 15,
      category: "Bottega Veneta",
      title:
        "V Logo Pocket Wool & Silk Dress Pullover Sweatshirt  Pullover Sweatshirt ",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product2.1.jpg",
      hoverImg: "/image/product2.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 16,
      category: "Fendi",
      title: "Melody Fleece Pullover Sweatshirt",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product1.1.jpg",
      hoverImg: "/image/product1.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 11,
      category: "Bottega Veneta",
      title:
        "V Logo Pocket Wool & Silk Dress Pullover Sweatshirt  Pullover Sweatshirt ",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product1.1.jpg",
      hoverImg: "/image/product1.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 12,
      category: "Fendi",
      title: "Melody Fleece Pullover Sweatshirt",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product2.1.jpg",
      hoverImg: "/image/product2.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 13,
      category: "Bottega Veneta",
      title:
        "V Logo Pocket Wool & Silk Dress Pullover Sweatshirt  Pullover Sweatshirt ",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product3.1.jpg",
      hoverImg: "/image/product3.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 14,
      category: "Fendi",
      title: "Melody Fleece Pullover Sweatshirt",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product4.1.jpg",
      hoverImg: "/image/product4.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 15,
      category: "Bottega Veneta",
      title:
        "V Logo Pocket Wool & Silk Dress Pullover Sweatshirt  Pullover Sweatshirt ",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product2.1.jpg",
      hoverImg: "/image/product2.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 16,
      category: "Fendi",
      title: "Melody Fleece Pullover Sweatshirt",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product1.1.jpg",
      hoverImg: "/image/product1.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 11,
      category: "Bottega Veneta",
      title:
        "V Logo Pocket Wool & Silk Dress Pullover Sweatshirt  Pullover Sweatshirt ",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product1.1.jpg",
      hoverImg: "/image/product1.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 12,
      category: "Fendi",
      title: "Melody Fleece Pullover Sweatshirt",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product2.1.jpg",
      hoverImg: "/image/product2.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 13,
      category: "Bottega Veneta",
      title:
        "V Logo Pocket Wool & Silk Dress Pullover Sweatshirt  Pullover Sweatshirt ",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product3.1.jpg",
      hoverImg: "/image/product3.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 14,
      category: "Fendi",
      title: "Melody Fleece Pullover Sweatshirt",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product4.1.jpg",
      hoverImg: "/image/product4.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 15,
      category: "Bottega Veneta",
      title:
        "V Logo Pocket Wool & Silk Dress Pullover Sweatshirt  Pullover Sweatshirt ",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product2.1.jpg",
      hoverImg: "/image/product2.2.jpg",
      oldPrice: 7500,
    },
    {
      id: 16,
      category: "Fendi",
      title: "Melody Fleece Pullover Sweatshirt",
      description:
        "A pair of pockets is often the best thing a dress can offer, and when they appear with the iconic Valentino logo, they really reach perfection.",
      price: 6500,
      image: "/image/product1.1.jpg",
      hoverImg: "/image/product1.2.jpg",
      oldPrice: 7500,
    },
  ];
  return (
    <>
      <div className="bg-[#E5E7EB]">
        <div className="base-container global-top">
          <div className=" breadcrumbs text-sm !py-3">
            <ul>
              <li>
                <a>Home</a>
              </li>
              <li>
                <a>Documents</a>
              </li>
              <li>Add Document</li>
            </ul>
          </div>

        </div>
      </div>

      <div className="base-container">
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {product?.map((item, index) => (
              <div key={index} className="pb-4">
                <ProductCard item={item} />
              </div>
            ))}
          </div>
      </div>
    </>
  );
};

export default CategoryPageProduct;
