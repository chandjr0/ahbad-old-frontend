// components/VideoPlayer.js
'use client'
import React,{Fragment} from "react";
import ReactPlayer from "react-player";
import { Dialog, Transition } from "@headlessui/react";

const VideoPlayer = ({ url,openModal,setOpenModal }) => {


  return (
    <Transition appear show={openModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-40 overflow-y-auto bg-opacity-60 bg-black dark:text-black"
        onClose={() => setOpenModal(false)}
      >
        <div className=" min-h-screen px-4 text-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500 translate-y-0"
            enterFrom="opacity-0 duration-300 scale-95 translate-y-0"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-300"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-[500px] min-h-[500px] p-4 xls:p-2 xms:p-2 xs:p-1 overflow-hidden text-left align-middle transition-all transform bg-gray-100 rounded-lg shadow-xl">
              <div className="video-player-wrapper flex items-center justify-center">
                <ReactPlayer
                  url={url}
                  controls={true}
                  width={500}
                  height={500}
                  className="react-player"
                />
                <style jsx>{`
                  .video-player-wrapper {
                    position: relative;
                  }
                  .react-player {
                    position: absolute;
                    top: 0;
                    left: 0;
                  }
                `}</style>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default VideoPlayer;
