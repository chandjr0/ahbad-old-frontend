"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import moment from "moment";
import Image from "next/image";
import { imageBasePath } from "@/config";

const ReviewModal = ({ openModal, setOpenModal }) => {
  const handleClose = () => {
    setOrderModalOpen(false);
  };

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleImageChange = (event) => {
    const files = event.target.files;
    const previews = [];
    const encodedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = () => {
        previews.push(reader.result);
      };

      reader.readAsDataURL(file);

      const readerForBase64 = new FileReader();

      readerForBase64.onloadend = () => {
        encodedFiles.push(readerForBase64.result);
        if (encodedFiles.length === files.length) {
          setImageFiles(encodedFiles);
          setImagePreviews(previews);
        }
      };

      readerForBase64.readAsDataURL(file);
    }
  };



  const handleSubmit = () => {

    setOpenModal(false)
  };

  return (
    <Transition appear show={openModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => setOpenModal(false)}
      >
        <div className="flex items-center justify-center min-h-screen">
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-white rounded-lg p-6 w-96">
              <Dialog.Title as="h3" className="text-lg font-medium mb-4">
                Review Your Order
              </Dialog.Title>
              <div className="mb-4">
                <label className="block mb-2">Rating:</label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      key={value}
                      className={`text-2xl cursor-pointer ${
                        value <= rating ? "text-yellow-500" : "text-gray-400"
                      }`}
                      onClick={() => handleRatingChange(value)}
                    >
                      &#9733;
                    </span>
                  ))}
                </div>
              </div>
              <div className="mb-4">
                <label className="block mb-2">Comment:</label>
                <textarea
                  value={comment}
                  onChange={handleCommentChange}
                  placeholder="Write your comment here..."
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Upload Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  multiple
                />
                <div className="flex items-center flex-wrap">
                  {imagePreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Preview ${index}`}
                      className="m-2  w-[70px] h-[70px]"
                    />
                  ))}
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded"
              >
                Submit Review
              </button>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ReviewModal;
