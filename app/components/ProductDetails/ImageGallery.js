"use client";

import { useState } from "react";

import { imageBasePath } from "@/config";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import ReactImageZoom from "react-image-zoom";
import VideoPlayer from "../videoPlayer";
const ImageGallery = ({ info }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [openModal, setOpenModal] = useState(false)
  console.log(`${imageBasePath}/${info?.galleryImage[selectedIndex]}`);


  const props = {
    width: 500,
    height: 500,
    zoomWidth: 200,
    scale: 1.0,
    zoomPosition: "default",
    img: info?.galleryImage?.length
      ? `${imageBasePath}/${info?.galleryImage[selectedIndex]}`
      : "/image/placeholder_600x.webp",
  };


  const handleBackClick = () => {
    setSelectedIndex(
      (prevIndex) =>
        (prevIndex - 1 + info?.galleryImage?.length) %
        info?.galleryImage?.length
    );
  };

  const handleForwardClick = () => {
    setSelectedIndex(
      (prevIndex) => (prevIndex + 1) % info?.galleryImage?.length
    );
  };

  const handleImageClick = (index) => {
    setSelectedIndex(index);
  };



  return (
    <div className="border border-gray-200  p-3 ">
      <div className="cursor-crosshair md:flex items-center justify-center hidden ">
        <ReactImageZoom {...props} />
      </div>
      <div className="md:hidden flex justify-center cursor-pointer">
        <Image
          src={`${
            info?.galleryImage?.length
              ? `${imageBasePath}/${info?.galleryImage[selectedIndex]}`
              : "/image/placeholder_600x.webp"
          } `}
          alt="Gallery image"
          height={450}
          width={450}
          priority
        />
      </div>
      <div className="mt-3 relative">
      
    
        <div className="grid grid-cols-5 gap-3">
          {info?.galleryImage?.map((item, index) => (
            <div
              key={index}
              className={`border ${
                index === selectedIndex ? "border-orange-500" : ""
              } cursor-pointer `}
              onClick={() => handleImageClick(index)}
            >
              <Image
                width={500}
                height={500}
                src={`${imageBasePath}/${item}`}
                alt={`Gallery image ${index + 1}`}
              />
            </div>
          ))}
        </div>

        <button
          className="absolute top-10 left-0 bg-gray-100 pl-2 pr-1 py-2"
          onClick={handleBackClick}
        >
          <IoIosArrowBack className="text-black" />
        </button>

        <button
          className="absolute top-10 right-0 bg-gray-100 pr-2 pl-1 py-2"
          onClick={handleForwardClick}
        >
          <IoIosArrowForward />
        </button>
      </div>
      {/* {info?.videoUrl?
      <div className="mt-2" onClick={()=>setOpenModal(true)}>
        <p className="cursor-pointer text-blue-400">See Video</p>
      </div>
      :null}
      <VideoPlayer setOpenModal={setOpenModal} openModal={openModal} url={info?.videoUrl} /> */}
    </div>
  );
};

export default ImageGallery;