import Link from 'next/link';
import React from 'react'
import { FaCheckCircle } from "react-icons/fa";

const RegisterSuccessfull = () => {
  return (
    <div className="min-h-[670px] bg-gray-100">
      <div className="max-w-7xl sm:max-w-[40rem] xls:mx-w-[24rem] xms:max-w-[22rem] xs:max-w-[16rem] mx-auto h-full">
        <div className="flex justify-center items-center h-full pt-40">
          <div>
            <div className='flex justify-center'>
              <FaCheckCircle className='text-green-400' size={30} />
            </div>
            <p className="text-3xl font-semibold text-center dark:text-black mt-3">
              Congratulations
            </p>
            <p className="pt-4 text-sm dark:text-black text-center">
              You have successfully registered. now you can join as a affiliate
              partner with us. our team will contact you very soon.
            </p>
            <Link href="/" className="flex justify-center mt-6">
                <button className='bg-gray-800 text-white font-semibold tracking-wider px-4 py-1 rounded-md'>
                     Go to home
                </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterSuccessfull