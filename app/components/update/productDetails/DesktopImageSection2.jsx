import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper/modules";
import Image from "next/image";
import { imageBasePath } from "@/config";

const DesktopImageSection2 = ({ 
  imageGallery, 
  selectVariationImage, 
  setSelectVariationImage,
  imagesWithVariationIds,
  selectedVariation 
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const mainSwiperRef = useRef(null);
  const thumbsSwiperRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  // Initialize based on imageGallery to prevent hydration mismatch
  const [isImageLoading, setIsImageLoading] = useState(!imageGallery || imageGallery.length === 0);

  useEffect(() => {
    if (imageGallery && imageGallery.length > 0) {
      setIsImageLoading(false);
    }
  }, [imageGallery]);

  // Effect to update active index when selectVariationImage changes
  useEffect(() => {
    if (imageGallery && imageGallery.length > 0) {
      const newIndex = imageGallery.findIndex(img => img === selectVariationImage);
      const validIndex = newIndex >= 0 ? newIndex : 0;
      setActiveIndex(validIndex);
      
      // Update main image swiper
      if (mainSwiperRef.current?.swiper) {
        mainSwiperRef.current.swiper.slideTo(validIndex);
      }
      
      // Update thumbnails position
      if (thumbsSwiperRef.current?.swiper) {
        const targetIndex = Math.max(0, Math.min(
          Math.floor(validIndex / 5) * 5,
          (imageGallery.length || 0) - 5
        ));
        thumbsSwiperRef.current.swiper.slideTo(targetIndex);
      }
    }
  }, [selectVariationImage, imageGallery]);

  // Effect to highlight variation images when variation changes
  useEffect(() => {
    if (selectedVariation && imagesWithVariationIds.length > 0) {
      const variationImageIndex = imagesWithVariationIds.findIndex(
        img => img.variationId === selectedVariation._id
      );
      if (variationImageIndex !== -1) {
        setActiveIndex(variationImageIndex);
        if (mainSwiperRef.current?.swiper) {
          mainSwiperRef.current.swiper.slideTo(variationImageIndex);
        }
      }
    }
  }, [selectedVariation, imagesWithVariationIds]);

  // Handle thumbnail click
  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    if (mainSwiperRef.current && mainSwiperRef.current.swiper) {
      mainSwiperRef.current.swiper.slideTo(index);
    }
    // Set the selected image URL
    if (imageGallery && imageGallery[index]) {
      setSelectVariationImage(imageGallery[index]);
    }
  };

  // Handle main slide change
  const handleMainSlideChange = (swiper) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);
    
    // Update selectVariationImage when main slide changes
    if (imageGallery && imageGallery[newIndex]) {
      setSelectVariationImage(imageGallery[newIndex]);
    }
    
    // Ensure the active thumbnail is visible in the thumbnail slider
    if (thumbsSwiperRef.current && thumbsSwiperRef.current.swiper) {
      const thumbSwiper = thumbsSwiperRef.current.swiper;
      const currentFirstVisible = thumbSwiper.activeIndex;
      const currentLastVisible = currentFirstVisible + 4;
      
      if (newIndex < currentFirstVisible || newIndex > currentLastVisible) {
        let targetIndex = Math.max(0, Math.min(newIndex - 2, imageGallery.length - 5));
        thumbSwiper.slideTo(targetIndex);
      }
    }
  };

  // Navigate thumbnails up
  const handlePrevThumbs = () => {
    if (thumbsSwiperRef.current && thumbsSwiperRef.current.swiper) {
      thumbsSwiperRef.current.swiper.slidePrev();
    }
  };

  // Navigate thumbnails down
  const handleNextThumbs = () => {
    if (thumbsSwiperRef.current && thumbsSwiperRef.current.swiper) {
      thumbsSwiperRef.current.swiper.slideNext();
    }
  };

  // Open modal and set the current image index
  const openModal = (index) => {
    setCurrentIndex(index);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Show next image in modal
  const showNextImage = () => {
    const nextIndex = (currentIndex + 1) % imageGallery.length;
    setCurrentIndex(nextIndex);
    if (imageGallery && imageGallery[nextIndex]) {
      setSelectVariationImage(imageGallery[nextIndex]);
    }
  };

  // Show previous image in modal
  const showPrevImage = () => {
    const prevIndex = (currentIndex + imageGallery.length - 1) % imageGallery.length;
    setCurrentIndex(prevIndex);
    if (imageGallery && imageGallery[prevIndex]) {
      setSelectVariationImage(imageGallery[prevIndex]);
    }
  };

  return (
    <div>
      {isImageLoading ? (
        <div className="flex gap-4 h-[450px]">
          <div className="w-1/5 bg-gray-100 animate-pulse"></div>
          <div className="w-4/5 mr-12 bg-gray-100 animate-pulse"></div>
        </div>
      ) : (
        <div className="flex gap-4">
          {/* Left Thumbnail Section - Vertical Slider */}
          <div className="w-1/5 h-[450px] relative mt-8">
            {/* Up arrow navigation button */}
            {imageGallery?.length > 5 && (
              <button 
                type="button"
                onClick={handlePrevThumbs}
                className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20 flex justify-center items-center text-white bg-black/70 hover:bg-black w-8 h-8 rounded-full shadow cursor-pointer"
                aria-label="Previous thumbnails"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
              </button>
            )}
            
            <Swiper
              ref={thumbsSwiperRef}
              direction={"vertical"}
              spaceBetween={10}
              slidesPerView={5}
              freeMode={true}
              watchSlidesProgress={true}
              modules={[FreeMode, Navigation]}
              className="h-full"
            >
              {imageGallery?.map((image, index) => {
                const imageInfo = imagesWithVariationIds[index];
                const isVariationImage = imageInfo?.variationId === selectedVariation?._id;
                
                return (
                  <SwiperSlide key={index}>
                    <div 
                      className={`h-[70px] w-full cursor-pointer border-2 ${
                        activeIndex === index 
                          ? "border-primary" 
                          : isVariationImage 
                            ? "border-secondary" 
                            : "border-transparent"
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    >
                      <Image
                        src={`${imageBasePath}/${image}`}
                        alt={`product-${index}`}
                        width={0}
                        height={0}
                        sizes="100px"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
            
            {/* Down arrow navigation button */}
            {imageGallery?.length > 5 && (
              <button 
                type="button"
                onClick={handleNextThumbs}
                className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex justify-center items-center text-white bg-black/70 hover:bg-black w-8 h-8 rounded-full shadow cursor-pointer"
                aria-label="Next thumbnails"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
            )}
          </div>

          {/* Right Main Image Section */}
          <div className="w-4/5 mr-12 h-[450px]">
            <Swiper
              ref={mainSwiperRef}
              style={{
                "--swiper-navigation-color": "#000",
                "--swiper-pagination-color": "#000",
                "height": "450px"
              }}
              spaceBetween={10}
              navigation={true}
              modules={[FreeMode, Navigation, Thumbs]}
              className="mySwiper2 h-full"
              onSlideChange={handleMainSlideChange}
            >
              {imageGallery?.map((image, index) => (
                <SwiperSlide key={index} onClick={() => openModal(index)} className="h-full">
                  <div className="w-full h-full flex items-center justify-center">
                    <Image
                      src={`${imageBasePath}/${image}`}
                      alt={`product-${index}`}
                      width={450}
                      height={450}
                      quality={100}
                      priority={index === activeIndex}
                      className="max-h-[450px] max-w-full cursor-pointer object-contain"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      )}

      {/* Modal for full-screen image view */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-[99] bg-black bg-opacity-75 flex items-center justify-center"
          onClick={closeModal}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl"
            onClick={closeModal}
          >
            &times;
          </button>

          <div
            className="relative"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={`${imageBasePath}/${imageGallery[currentIndex]}`}
              alt={`current product-${currentIndex}`}
              width={800}
              height={600}
              objectFit="contain"
            />

            <button
              className="absolute text-3xl h-12 w-12 rounded-full shadow left-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary text-black hover:text-white flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
                showPrevImage();
              }}
            >
              &#8249;
            </button>

            <button
              className="absolute text-3xl h-12 w-12 rounded-full shadow right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-primary text-black hover:text-white flex items-center justify-center"
              onClick={(e) => {
                e.stopPropagation();
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

export default DesktopImageSection2;
