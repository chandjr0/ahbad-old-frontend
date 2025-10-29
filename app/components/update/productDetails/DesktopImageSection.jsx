import { imageBasePath } from "@/config";
import Image from "next/image";
import React, { useState } from "react";

const ImageSection = ({ imageGallery }) => {


  // State for modal visibility and image index
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Open modal and set the current image index
  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Show next image
  const showNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imageGallery.length);
  };

  // Show previous image
  const showPrevImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + imageGallery.length - 1) % imageGallery.length
    );
  };

  return (
    <div>
      {/* Image grid */}
      <div className="grid grid-cols-2">
        {imageGallery?.slice(0,4)?.map((image, index) => (
          <div
            key={index}
            className="relative w-full lg:h-[738px] group cursor-pointer"
            onClick={() => openModal(index)}
          >
            <Image
              src={`${imageBasePath}/${image}`}
              alt={`product-${index}`}
              height={0}
              width={0}
              sizes={100}
              className="w-full h-full object-fill"
            />
            <div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                       border border-black bg-white shadow w-[5rem] h-[5rem] 
                       rounded-full flex items-center justify-center 
                       opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <p className="text-4xl !font-light">+</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for full-screen image view */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[99] bg-black bg-opacity-75 flex items-center justify-center"
          onClick={closeModal} // Close modal when clicking outside image
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={closeModal}
          >
            &times;
          </button>

          {/* Image display */}
          <div
            className="relative"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking on image or controls
          >
            <Image
              src={`${imageBasePath}/${imageGallery[currentIndex]}`}
              alt={`current product-${currentIndex}`}
              width={800}
              height={600}
              objectFit="contain"
            />

            {/* Prev button */}
            <button
              className="absolute text-3xl h-12 w-12 rounded-full shadow left-0 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2"
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal close on button click
                showPrevImage();
              }}
            >
              &#8249;
            </button>

            {/* Next button */}
            <button
              className="absolute text-3xl h-12 w-12 rounded-full shadow right-0 top-1/2 transform -translate-y-1/2 bg-white text-black px-4 py-2"
              onClick={(e) => {
                e.stopPropagation(); // Prevent modal close on button click
                showNextImage();
              }}
            >
              &#8250;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSection;
