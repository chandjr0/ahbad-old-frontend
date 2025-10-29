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

const MobileImageSection = ({ 
  imageGallery, 
  selectVariationImage, 
  setSelectVariationImage,
  imagesWithVariationIds = [],
  selectedVariation 
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const mainSwiperRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Effect to set the active index based on selectVariationImage
  useEffect(() => {
    if (imageGallery && imageGallery.length > 0) {
      const newIndex = imageGallery.findIndex(img => img === selectVariationImage);
      const validIndex = newIndex >= 0 ? newIndex : 0;
      setActiveIndex(validIndex);
      
      if (mainSwiperRef.current?.swiper) {
        mainSwiperRef.current.swiper.slideTo(validIndex);
      }
    }
  }, [selectVariationImage, imageGallery]);

  // Effect to highlight variation images when variation changes
  useEffect(() => {
    if (selectedVariation && imagesWithVariationIds?.length > 0) {
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

  const handleThumbnailClick = (index) => {
    setActiveIndex(index);
    if (mainSwiperRef.current?.swiper) {
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
    // Set the selected image URL
    if (imageGallery && imageGallery[newIndex]) {
      setSelectVariationImage(imageGallery[newIndex]);
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

  // Show next image
  const showNextImage = () => {
    const nextIndex = (currentIndex + 1) % imageGallery.length;
    setCurrentIndex(nextIndex);
    if (imageGallery && imageGallery[nextIndex]) {
      setSelectVariationImage(imageGallery[nextIndex]);
    }
  };

  // Show previous image
  const showPrevImage = () => {
    const prevIndex = (currentIndex + imageGallery.length - 1) % imageGallery.length;
    setCurrentIndex(prevIndex);
    if (imageGallery && imageGallery[prevIndex]) {
      setSelectVariationImage(imageGallery[prevIndex]);
    }
  };

  return (
    <div>
      {/* Main Swiper for the image */}
      <Swiper
        ref={mainSwiperRef}
        spaceBetween={10}
        navigation={true}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs]}
        onSlideChange={handleMainSlideChange}
        className="mainSwiper"
      >
        {imageGallery?.map((image, index) => (
          <SwiperSlide key={index} onClick={() => openModal(index)}>
            <div className="w-full h-auto aspect-[1/1]">
              <Image
                src={`${imageBasePath}/${image}`}
                alt={`product-${index}`}
                layout="responsive"
                width={0}
                height={0}
                sizes={100}
                className="w-full h-full cursor-pointer"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper */}
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Thumbs]}
        className="thumbnailSwiper mt-4"
      >
        {imageGallery?.map((image, index) => {
          // Safely access imagesWithVariationIds
          const imageInfo = imagesWithVariationIds?.[index];
          const isVariationImage = imageInfo?.variationId === selectedVariation?._id;
          
          return (
            <SwiperSlide key={index}>
              <div
                className={`cursor-pointer ${
                  activeIndex === index 
                    ? "border-2 border-[#337AB7]" 
                    : isVariationImage 
                      ? "border-2 border-secondary"
                      : ""
                }`}
                onClick={() => handleThumbnailClick(index)}
              >
                <Image
                  src={`${imageBasePath}/${image}`}
                  alt={`product-thumbnail-${index}`}
                  layout="intrinsic"
                  width={100}
                  height={100}
                  sizes="(max-width: 768px) 25vw, 100px"
                  className="w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

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

export default MobileImageSection;
