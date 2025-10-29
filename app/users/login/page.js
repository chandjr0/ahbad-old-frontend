"use client";
import BreadCrumbs from "@/app/components/Common/Breadcumb";
import { useStatus } from "@/context/contextStatus";
import postRequest from "@/lib/postRequest";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCookie } from "nookies";
import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { Triangle } from "react-loader-spinner";
import { toast } from "react-toastify";
import * as yup from "yup";

const Login = () => {
  const bdMobilePattern = /^(\+)?(88)?01[3-9]\d{8}$/;
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  const router = useRouter();
  const { setToken } = useStatus();
  const modalRef = useRef(null);
  const [otpUserType, setOtpUserType] = useState("");
  const [otpPhone, setOtpPhone] = useState("");

  const [visible, setVisible] = useState(false);

  const phoneValidation = yup
    .string()
    .required("খালি স্থানটি পূরণ আবশ্যক")
    .matches(bdMobilePattern, "সঠিক নাম্বার নয়")
    .min(11, "১১ ডিজিটের মোবাইল নাম্বার হতে হবে")
    .max(11, "১১ ডিজিটের মোবাইল নাম্বার হতে হবে");

  const schema = yup.object().shape({
    phone: phoneValidation,
    password: yup
      .string()
      .min(6, "আপনার পাসওয়ার্ড টি ৬ ডিজিটের হতে হবে")
      .required("খালি স্থানটি পূরণ আবশ্যক"),
  });

  const otpSchema = yup.object().shape({
    phone: phoneValidation,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const {
    register: registerOtp,
    handleSubmit: handleSubmitOtp,
    formState: { errors: otpErrors },
  } = useForm({
    resolver: yupResolver(otpSchema),
  });

  // registration function
  const handleLogin = async (data) => {
    setIsLoading(true);
    try {
      let res = await postRequest(`customer/admin/login`, data);
      if (res?.success) {
        toast.success(res?.message);
        setIsLoading(false);
        setCookie(
          null,
          "userInfo",
          JSON.stringify({ id: res?.data?._id, phone: res?.data?.phone, name: res?.data?.name }),
          {
            maxAge: 24 * 60 * 60,
            path: "/",
          }
        );
        setCookie(null, "token", res?.data?.token, {
          maxAge: 24 * 60 * 60,
          path: "/",
        });
        setToken(res?.data?.token);
        router.push("/users/profile");
      } else {
        toast.warning(res?.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error in registration", error);
      setIsLoading(false);
    }
  };

  // OTP login request
  const handleOtpLogin = async (data) => {
    setIsOtpLoading(true);
    try {
      let res = await postRequest(`customer/admin/login-otp-send`, data);
      if (res?.success) {
        toast.success(res?.message);
        setOtpPhone(data.phone);
        if (modalRef.current) {
          modalRef.current.showModal();
        }
      } else {
        toast.warning(res?.message);
      }
    } catch (error) {
      console.log("error in OTP login request", error);
    } finally {
      setIsOtpLoading(false);
    }
  };

  // OTP verification
  const otpSubmit = async (e) => {
    e.preventDefault();

    if (!otpUserType || otpUserType.length < 4) {
      toast.error("Please enter a valid OTP");
      return;
    }

    const requestData = {
      phone: otpPhone,
      otpCode: otpUserType
    };

    try {
      let res = await postRequest(`customer/admin/login-otp-verify`, requestData);

      if (res?.success) {
        toast.success(res?.message);
        modalRef.current.close();

        setCookie(
          null,
          "userInfo",
          JSON.stringify({ id: res?.data?._id, phone: res?.data?.phone, name: res?.data?.name }),
          {
            maxAge: 24 * 60 * 60,
            path: "/",
          }
        );
        setCookie(null, "token", res?.data?.token, {
          maxAge: 24 * 60 * 60,
          path: "/",
        });
        setToken(res?.data?.token);
        router.push("/users/profile");
      } else {
        toast.error(res?.message);
        setOtpUserType("");
      }
    } catch (error) {
      console.error("Error during OTP verification:", error);
      toast.error("Failed to verify OTP");
    }
  };

  const toggleBtn = () => {
    setVisible(!visible);
  };

  const breadCumbs = [{ name: "Home", url: "/" }, { name: `Login` }];

  return (
    <div>
      <div className="bg-white ">
        <div className="bg-gray-200 py-4 px-8">
          <BreadCrumbs breadCumbs={breadCumbs} />
        </div>

        <div className="base-container text-black my-8">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="border border-gray-200 p-8">
              <p className="text-2xl font-light py-5 uppercase">Sign In</p>

              <div className="flex flex-col">
                {/* Password Login Form */}
                <form
                  className="border border-gray-200 p-8"
                  onSubmit={handleSubmit(handleLogin)}
                >
                  <div>
                    <div className="relative pt-6">
                      <label className="text-sm font-bold">
                        Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <div className="w-full ">
                        <input
                          type="text"
                          name="phone"
                          className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
                          placeholder="আপনার ১১ ডিজিটের মোবাইল নাম্বারটি লিখুন"
                          maxLength={11}
                          {...register("phone")}
                        />
                      </div>
                      <div className="absolute top-[95px] md:left-0 left-0 text-red-600 text-xs pl-1">
                        {errors.phone?.message}
                      </div>
                    </div>

                    <div className="relative pt-6">
                      <label className="text-sm font-bold">
                        Password <span className="text-red-600">*</span>
                      </label>
                      <div className="relative w-full">
                        <input
                          type={visible ? "text" : "password"}
                          className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
                          placeholder="****"
                          {...register("password")}
                        />

                        <div onClick={toggleBtn} className="cursor-pointer">
                          {!visible ? (
                            <svg
                              className="absolute top-3 right-2 text-gray-400 fill-current h-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                            >
                              <path fill="none" d="M0 0h24v24H0z" />
                              <path d="M17.882 19.297A10.949 10.949 0 0 1 12 21c-5.392 0-9.878-3.88-10.819-9a10.982 10.982 0 0 1 3.34-6.066L1.392 2.808l1.415-1.415 19.799 19.8-1.415 1.414-3.31-3.31zM5.935 7.35A8.965 8.965 0 0 0 3.223 12a9.005 9.005 0 0 0 13.201 5.838l-2.028-2.028A4.5 4.5 0 0 1 8.19 9.604L5.935 7.35zm6.979 6.978l-3.242-3.242a2.5 2.5 0 0 0 3.241 3.241zm7.893 2.264l-1.431-1.43A8.935 8.935 0 0 0 20.777 12 9.005 9.005 0 0 0 9.552 5.338L7.974 3.76C9.221 3.27 10.58 3 12 3c5.392 0 9.878 3.88 10.819 9a10.947 10.947 0 0 1-2.012 4.592zm-9.084-9.084a4.5 4.5 0 0 1 4.769 4.769l-4.77-4.769z" />
                            </svg>
                          ) : (
                            <svg
                              className="absolute top-3 right-2 text-gray-400 fill-current h-5"
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              width="24"
                              height="24"
                            >
                              <path fill="none" d="M0 0h24v24H0z" />
                              <path d="M12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9C2.121 6.88 6.608 3 12 3zm0 16a9.005 9.005 0 0 0 8.777-7 9.005 9.005 0 0 0-17.554 0A9.005 9.005 0 0 0 12 19zm0-2.5a4.5 4.5 0 1 1 0-9 4.5 4.5 0 0 1 0 9zm0-2a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z" />
                            </svg>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 md:left-0 left-0 text-red-600 text-xs pl-1">
                        {errors.password?.message}
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-secondary text-center mt-4 text-white font-bold py-3 uppercase"
                  >
                    {!isLoading ? (
                      "LOGIN"
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
                </form>

                {/* OTP Login Form */}
                <div className="mt-8">
                  <p className="text-lg font-medium mb-4">Login with OTP</p>
                  <form
                    className="border border-gray-200 p-8"
                    onSubmit={handleSubmitOtp(handleOtpLogin)}
                  >
                    <div className="relative pt-2">
                      <label className="text-sm font-bold">
                        Mobile Number <span className="text-red-600">*</span>
                      </label>
                      <div className="w-full">
                        <input
                          type="text"
                          name="phone"
                          className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
                          placeholder="আপনার ১১ ডিজিটের মোবাইল নাম্বারটি লিখুন"
                          maxLength={11}
                          {...registerOtp("phone")}
                        />
                      </div>
                      <div className="mt-2 md:left-0 left-0 text-red-600 text-xs pl-1">
                        {otpErrors.phone?.message}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-secondary text-center mt-4 text-white font-bold py-3 uppercase"
                    >
                      {!isOtpLoading ? (
                        "GET OTP"
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
                  </form>
                </div>

                <p className="mt-3">
                  <span className="text-secondary font-semibold">
                    <Link href="/users/forgetPassword">Forgot Password?</Link>
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-black bg-opacity-75 relative">
              <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full grid justify-center">
                <Link
                  href={`/users/register`}
                  className=" py-3 px-20 bg-blue-700 text-white font-bold"
                >
                  Click here to Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <dialog ref={modalRef} id="otp_modal" className="modal">
        <div className="modal-box w-11/12 max-w-md p-6">
          <h3 className="font-bold text-2xl text-center mb-4">
            Verify Your OTP
          </h3>
          <p className="text-gray-600 text-center mb-6">
            Please enter the One-Time Password (OTP) sent to your registered
            mobile number.
          </p>

          {/* OTP Input Form */}
          <form className="flex flex-col items-center" onSubmit={otpSubmit}>
            <input
              type="text"
              maxLength="6"
              placeholder="Enter OTP"
              className="input input-bordered w-full max-w-xs text-center text-lg tracking-widest mb-4"
              value={otpUserType}
              onChange={(e) => setOtpUserType(e.target.value)}
              required
            />

            <div className="flex justify-between gap-4 w-full">
              {/* Close Button */}
              <button
                type="button"
                className="btn bg-black text-white w-full max-w-[45%]"
                onClick={() => modalRef.current.close()}
              >
                Close
              </button>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn bg-primary text-white w-full max-w-[45%]"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Login;
