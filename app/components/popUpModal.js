// components/Modal.js
"use client";
import { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { imageBasePath } from "@/config";
import Image from "next/image";
import { useStatus } from "@/context/contextStatus";
import { destroyCookie, parseCookies,setCookie } from "nookies";


const ModalComp = () => {

  const [showModal, setShowModal] = useState(false);
  const { settingsData } = useStatus();
  const cookie = parseCookies();


  useEffect(() => {

    let visited = cookie["visited"]

    if ( !visited && settingsData?.popupImg?.isShow) {
      setShowModal(true);
      setCookie(null, "visited", true, {
        maxAge: 3600,
        path: "/",
      });
    }

  }, [settingsData]);

  return (
    <>
      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-40 overflow-y-auto bg-opacity-60 bg-black dark:text-black"
          onClose={() => setShowModal(false)}
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
              <div className="inline-block w-full max-w-[800px] min-h-[300px] p-4 xls:p-2 xms:p-2 xs:p-1 overflow-hidden text-left align-middle transition-all transform bg-gray-100 rounded-lg shadow-xl">
                <Image
                  width={900}
                  height={900}
                  src={`${imageBasePath}/${settingsData?.popupImg?.web}`}
                  onClick={()=>window.open(`${settingsData?.popupImg?.url}`, '_blank')}
                />
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ModalComp;
