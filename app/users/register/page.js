"use client";
import BreadCrumbs from "@/app/components/Common/Breadcumb";
import postRequest from "@/lib/postRequest";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Triangle } from "react-loader-spinner";
import { toast } from "react-toastify";
import * as yup from "yup";

const Register = () => {


  const bdMobilePattern = /^(\+)?(88)?01[3-9]\d{8}$/;
  const [isOtp, setIsOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [visible, setVisible] = useState(false);

  const router = useRouter();

   const toggleBtn = () => {
     setVisible(!visible);
   };

  const phoneValidation = yup
    .string()
    .required("খালি স্থানটি পূরণ আবশ্যক")
    .matches(bdMobilePattern, "সঠিক নাম্বার নয়")
    .min(11, "১১ ডিজিটের মোবাইল নাম্বার হতে হবে")
    .max(11, "১১ ডিজিটের মোবাইল নাম্বার হতে হবে");

  const schema = yup.object().shape({
    name: yup.string().required("খালি স্থানটি পূরণ আবশ্যক"),
    phone: phoneValidation,
    //  email: yup.string().required("খালি স্থানটি পূরণ আবশ্যক"),
    password: yup
      .string()
      .min(6, "আপনার পাসওয়ার্ড টি ৬ ডিজিটের হতে হবে")
      .required("খালি স্থানটি পূরণ আবশ্যক"),
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

  // registration function 
  const handleRegister = async (data) => {
    setIsLoading(true);
    try {
      let res = await postRequest(`customer/admin/direct-register`, data);
      if (res?.success) {
        toast.success(res?.message);
        // setIsOtp(true);
        router.push("/users/login");
        setIsLoading(false);
      } else {
        toast.warning(res?.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error in registration", error);
      setIsLoading(false);
    }
  };

  // confirm otp function
  const sendOtp = async () => {
    setIsLoading(true);
    try {
      let res = await postRequest(`customer/admin/register-otp-verify`, {
        otpCode,
      });
      if (res?.success) {
        toast.success(res?.message);
        router.push("/users/login");
        setIsLoading(false);
      } else {
        toast.error(res?.message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("error in sendOtp", error);
      setIsLoading(false);
    }
  };

  // otp count down timer 

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(intervalId);
      setIsOtp(false)
    }

    return () => clearInterval(intervalId);
  }, [countdown]);

  const breadCumbs = [{ name: "Home", url: "/" }, { name: `register` }];

  return (
    <div>
      <div className="bg-white ">
        <div className="bg-gray-200 py-4 px-8">
          <BreadCrumbs breadCumbs={breadCumbs} />
        </div>

        <div className="base-container min-h-[600px]  text-black my-8">
          <div className="grid grid-cols-1 md:grid-cols-2 ">
            <div class="bg-black bg-opacity-75 relative">
              <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full grid justify-center">
                <Link
                  href={`/users/login`}
                  className=" py-3 px-20 bg-blue-700 text-white font-bold"
                >
                  Click here to Sign In
                </Link>
              </div>
            </div>
            <form
              className="border border-gray-200 p-8"
              onSubmit={handleSubmit(handleRegister)}
            >
              {isOtp ? (
                <p className="text-2xl font-light py-5 uppercase">
                  OTP VERIFICATION
                </p>
              ) : (
                <p className="text-2xl font-light py-5 uppercase">Sign Up</p>
              )}
              {isOtp ? (
                <div>
                  <div className="relative pt-4">
                    <label className="text-sm font-bold">
                      OTP CODE <span className="text-red-600">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
                        placeholder="OTP কোডটি প্রদান করুন"
                        onChange={(e) => setOtpCode(e.target.value)}
                        value={otpCode}
                      />
                    </div>
                  </div>
                  <div className="py-2">
                    <p>
                      {" "}
                      Time Remaining :{" "}
                      <span className="font-semibold">{countdown}</span> Seconds
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="relative pt-4">
                    <label className="text-sm font-bold">
                      Full name <span className="text-red-600">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
                        placeholder="আপনার নামটি লিখুন"
                        {...register("name")}
                      />
                    </div>
                    <div className="absolute top-[90px] md:left-0 left-0 text-red-600 text-xs pl-1">
                      {errors.name?.message}
                    </div>
                  </div>

                  <div className="relative pt-6">
                    <label className="text-sm font-bold">
                      Mobile Number <span className="text-red-600">*</span>
                    </label>
                    <div className="w-full ">
                      <input
                        type="number"
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
                    <label className="text-sm font-bold">Email</label>
                    <div className="w-full ">
                      <input
                        type="email"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-secondary"
                        placeholder="আপনার ইমেইলটি লিখুন"
                        {...register("email")}
                      />
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
                    <div className="absolute top-[95px] md:left-0 left-0 text-red-600 text-xs pl-1">
                      {errors.password?.message}
                    </div>
                  </div>
                </div>
              )}

              <>
                {isOtp ? (
                  <p
                    onClick={() => sendOtp()}
                    className="w-full bg-secondary text-center mt-6 text-white font-bold py-2 uppercase cursor-pointer"
                  >
                    {!isLoading ? (
                      "SEND OTP"
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
                  </p>
                ) : (
                  <button
                    type="submit"
                    className="w-full bg-secondary text-center mt-6 text-white font-bold py-3 uppercase"
                  >
                    {!isLoading ? (
                      "REGISTER"
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
                )}
              </>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
