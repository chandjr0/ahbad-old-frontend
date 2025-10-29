"use client";

import postRequest from "@/lib/postRequest";
import request from "@/lib/request";
import Link from "next/link";
import react, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Triangle } from "react-loader-spinner";

const ForgetPassword = () => {

  const [userPhone, setUserPhone] = useState("");
  const [isOtpPhase, setIsOtpPhase] = useState(false);
  const [isPasswordPhase, setIsPasswordPhase] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [token, setToken] = useState('')
  const [isLoading, setIsLoading] = useState('')
  const router = useRouter();

  const submitPhone = async (val) => {
    setIsLoading(true)
    if (val == 1) {
      try {
        let res = await postRequest(`customer/admin/forget-password`, {
          phone: userPhone,
        });
        if (res?.success) {
          setIsOtpPhase(true);
          toast.success(res?.message);
          setIsLoading(false)
        }else{
          toast.error(res?.message);
          setIsLoading(false)
        }
      } catch (error) {
        console.log("err in forgot password", error);
      }
    } else if(val == 2) {
      try {
        let res = await postRequest(`customer/admin/verify-reset-otp`, {
          otpCode,
        });
        if (res?.success) {

          setIsOtpPhase(false);
          setIsPasswordPhase(true)
          setToken(res?.token)
          toast.success(res?.message);
          setIsLoading(false)

        }else{
          toast.error(res?.message);
          setIsLoading(false)
        }
      } catch (error) {
        console.log("err in forgot password", error);
      }
    }else{
      if(password == confirmPassword){

      try {
        let res = await postRequest(`customer/admin/reset-password`, {
          password,
          token: token
        });
        if (res?.success) {
          setIsOtpPhase(true);
          toast.success(res?.message);
          setIsLoading(false)
          router.push("/users/login");
        }else{
          toast.error(res?.message);
          setIsLoading(false)
        }
      } catch (error) {
        console.log("err in forgot password", error);
      }
    }else{
      toast.error("Password didn't Matched");
    }

    }
  };

  return (
    <div>
      <div className="bg-white">
        <div className="max-w-[40rem] min-h-[500px] mx-auto text-black py-8">
          <div className="border border-gray-200 p-8">
            <p className="text-2xl font-light py-5 uppercase">
              FORGOT PASSWORD
            </p>
            {isPasswordPhase ? (
              <div>
                <div>
                  <div className="pt-4">
                    <label className="text-sm font-bold">
                      Password <span className="text-red-600">*</span>
                    </label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="enter password...."
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <div className="pt-4">
                    <label className="text-sm font-bold">
                      Confirm Password <span className="text-red-600">*</span>
                    </label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="confirm password...."
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        value={confirmPassword}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {isOtpPhase ? (
                  <div>
                    <div className="pt-4">
                      <label className="text-sm font-bold">
                        Otp Code <span className="text-red-600">*</span>
                      </label>
                      <div className="w-full pt-2">
                        <input
                          type="text"
                          className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
                          placeholder="enter your otp...."
                          onChange={(e) => setOtpCode(e.target.value)}
                          value={otpCode}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="pt-4">
                      <label className="text-sm font-bold">
                        Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <div className="w-full pt-2">
                        <input
                          type="number"
                          name="phone"
                          className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
                          placeholder="enter your number...."
                          onChange={(e) => setUserPhone(e.target.value)}
                          maxLength={11}
                          value={userPhone}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <button
              onClick={() =>
                submitPhone(isOtpPhase ? 2 : isPasswordPhase ? 3 : 1)
              }
              className="w-full bg-secondary text-center mt-4 text-white font-bold py-3 uppercase"
            >
              {!isLoading ? (
                "SUBMIT"
              ) : (
                <div className="flex items-center justify-center">
                  <Triangle
                    visible={true}
                    height="40"
                    width="50"
                    color="#fff"
                    ariaLabel="triangle-loading"
                  />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
