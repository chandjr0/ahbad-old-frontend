import React, { useState, useEffect } from 'react';
import { imageBasePath } from "@/config";

const MobileImageSection2 = ({ imageGallery, selectVariationImage }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);

  useEffect(() => {
    if (imageGallery && imageGallery.length > 0) {
      setIsImageLoading(false);
    }
  }, [imageGallery]);

  // Effect to update active index when selectVariationImage changes
  useEffect(() => {
    if (imageGallery && imageGallery.length > 0 && selectVariationImage) {
      const newIndex = imageGallery.findIndex(img => img === selectVariationImage);
      if (newIndex !== -1) {
        setActiveIndex(newIndex);
        setCurrentIndex(newIndex);
      }
    }
  }, [selectVariationImage, imageGallery]);

  return (
    <div>
      {isImageLoading ? (
        <div className="h-[300px] bg-gray-100 animate-pulse"></div>
      ) : (
        <div>
          <div className="relative">
            <div className="w-full h-[300px] overflow-hidden">
              <img
                src={`${imageBasePath}/${imageGallery[activeIndex]}`}
                alt="Product"
                className="w-full h-full object-contain"
                onClick={() => {
                  setIsModalOpen(true);
                  setCurrentIndex(activeIndex);
                }}
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {imageGallery?.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === activeIndex ? 'bg-black' : 'bg-gray-300'
                  }`}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
          <div className="relative w-full h-full">
            <button
              className="absolute top-4 right-4 text-white text-2xl"
              onClick={() => setIsModalOpen(false)}
            >
              ×
            </button>
            <div className="w-full h-full flex items-center justify-center">
              <img
                src={`${imageBasePath}/${imageGallery[currentIndex]}`}
                alt="Product"
                className="max-w-full max-h-full object-contain"
              />
            </div>
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              {imageGallery?.map((_, index) => (
                <button
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentIndex ? 'bg-white' : 'bg-gray-300'
                  }`}
                  onClick={() => setCurrentIndex(index)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MobileImageSection2; 