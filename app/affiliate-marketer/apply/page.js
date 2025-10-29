"use client";

import react, { useState } from "react";
import BreadCrumbs from "@/app/components/Common/Breadcumb";
import postRequest from "@/lib/postRequest";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useDropzone } from "react-dropzone";
import { TiDeleteOutline } from "react-icons/ti";
import SingleNidImageUpload from "@/app/components/AffiliateMarketer/SingleNidImageUpload";
import SingleProfileImageUpload from "@/app/components/AffiliateMarketer/SIngleProfileImageUpload";

const Register = () => {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const bdMobilePattern = /^(\+)?(88)?01[3-9]\d{8}$/;

  const phoneValidation = yup
    .string()
    .required("The field is required")
    .matches(bdMobilePattern, "Not a valid number")
    .min(11, "Number must be 11 digits")
    .max(11, "Number must be 11 digits");

  const schema = yup.object().shape({
    name: yup.string().required("The field is required"),
    phone: phoneValidation,
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    referId: yup.string().nullable(),
    whatsAppNo: yup.string().nullable(),
    fbId: yup.string().required("The field is required"),
    fbPage: yup.string().required("The field is required"),
    password: yup
      .string()
      .min(6, "Password should be at least 6 characters")
      .required("The field is required"),
    domain: yup.string().nullable(),
    url: yup.string().nullable(),
    number: yup.string().required("The field is required"),
    //  present: yup.string().required("The field is required"),
    //  permanent: yup.string().required("The field is required"),
    office: yup.string().nullable(),
    password_confirmation: yup
      .string()
      .oneOf([yup.ref("password"), null], "confirm passwords must match"),
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

  const toggleBtn = () => {
    setVisible(!visible);
  };

  const breadCumbs = [
    { name: "Home", url: "/" },
    // { name: `Sign up for reseller` },
  ];

  const [images, setImages] = useState([]);
  const [nidImage, setNidImage] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [visibleChangePassConfirm, setVisibleChangePassConfirm] =
    useState(false);

  const toggleBtnChangePassConfirm = () => {
    setVisibleChangePassConfirm(!visibleChangePassConfirm);
  };

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setImages((prevImages) => [...prevImages, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
  });

  const handleApply = async (data) => {
    delete data?.password_confirmation;

    if (profileImage == null) {
      toast.error("Profile image is required");
      return;
    }

    if (nidImage == null) {
      toast.error("NID image is required");
      return;
    }

    const obj = {

      referId: data?.referId,
      name: data?.name,
      phone: data?.phone,
      email: data?.email.toLowerCase(),
      fbId: data?.fbId,
      fbPageName: data?.fbPage,
      whatsAppNo: data?.whatsAppNo,
      image: profileImage ? profileImage : "",
      nid: {
        number: data?.number,
        nidImage: nidImage ? nidImage : "",
      },
      address: {
        present: data?.present,
        permanent: data?.permanent,
        office: data?.office,
      },
      legalDocs: images,
      website: {
        domain: data?.domain,
        url: data?.url,
      },
      password: data?.password,
    };

    let res = await postRequest(`reseller/submit-by-visitor`,obj);

    if (res?.success) {
      toast.success(`${res?.message}`);
      router.push(`/affiliate-marketer/register-successful`);
    } else {
      toast.error(`${res?.message}`);
    }
  };

  return (
    <div>
      <div className="bg-white pb-3">
        <div className="bg-gray-200 py-4 px-8">
          <BreadCrumbs breadCumbs={breadCumbs} />
        </div>

        <div className="max-w-2xl min-h-[600px] mx-auto text-black my-8">
          <div>
            <div className="border border-gray-200 p-8">

              <form
                onSubmit={handleSubmit(handleApply)}
                className="grid grid-cols-1 gap-6"
              >
                <div>
                  <div className="relative pt-4">
                    <label className="text-sm font-bold">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <div className="w-full">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter name...."
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
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter mobile number..."
                        maxLength={11}
                        {...register("phone")}
                      />
                    </div>
                    <div className="absolute top-[100px] md:left-0 left-0 text-red-600 text-xs pl-1">
                      {errors.phone?.message}
                    </div>
                  </div>

                  <div className="relative pt-6">
                    <label className="text-sm font-bold">
                      Email<span className="text-red-600">*</span>
                    </label>
                    <div className="w-full ">
                      <input
                        type="email"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter email address..."
                        {...register("email")}
                      />
                    </div>
                    <div className="absolute top-[100px] md:left-0 left-0 text-red-600 text-xs pl-1">
                      {errors.email?.message}
                    </div>
                  </div>

                  <div className="relative pt-6">
                    <label className="text-sm font-bold">
                      Facebook Profile Link{" "}
                      <span className="text-red-600">*</span>
                    </label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter facebook ID..."
                        {...register("fbId")}
                      />
                    </div>
                    <div className="absolute top-[100px] md:left-0 left-0 text-red-600 text-xs pl-1">
                      {errors.fbId?.message}
                    </div>
                  </div>
                  <div className="relative pt-6">
                    <label className="text-sm font-bold">
                      Facebook Page Link <span className="text-red-600">*</span>
                    </label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter facebook Page..."
                        {...register("fbPage")}
                      />
                    </div>
                    <div className="absolute top-[100px] md:left-0 left-0 text-red-600 text-xs pl-1">
                      {errors.fbPage?.message}
                    </div>
                  </div>

                  <div className="relative pt-4">
                    <label className="text-sm font-bold">Refer ID</label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter refer ID....."
                        {...register("referId")}
                      />
                    </div>
                    <div className="absolute top-11 md:left-0 left-0 text-red-600 text-sm">
                      {errors.referId?.message}
                    </div>
                  </div>

                  <div className="relative pt-4">
                    <label className="text-sm font-bold">Whatsapp Number</label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter whatsapp number...."
                        {...register("whatsAppNo")}
                      />
                    </div>
                    <div className="absolute top-11 md:left-0 left-0 text-red-600 text-sm">
                      {errors.whatsAppNo?.message}
                    </div>
                  </div>

                  <div className="relative pt-4">
                    <label className="text-sm font-bold">Password</label>
                    <div className="mt-1 relative">
                      <input
                        type={visible ? "text" : "password"}
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary
      "
                        placeholder="Enter password ..."
                        {...register("password")}
                      />
                      <div onClick={toggleBtn}>
                        {visible ? (
                          <svg
                            className="absolute top-2 right-2 text-gray-400 fill-current h-5"
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
                            className="absolute top-2 right-2 text-gray-400 fill-current h-5"
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
                    <p className="absolute top-[90px] md:left-0 left-0 text-red-600 text-sm">
                      {errors.password?.message}
                    </p>
                  </div>

                  <div className="relative w-full pt-4">
                    <label className="text-sm font-bold">
                      Password confirmation
                    </label>
                    <div className="relative mt-1">
                      <input
                        type={visibleChangePassConfirm ? "text" : "password"}
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter password conformation ..."
                        {...register("password_confirmation")}
                      />
                      <div onClick={toggleBtnChangePassConfirm}>
                        {visibleChangePassConfirm ? (
                          <svg
                            className="absolute top-2 right-2 text-gray-400 fill-current h-5"
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
                            className="absolute top-2 right-2 text-gray-400 fill-current h-5"
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
                    <p className="absolute top-[90px] md:left-0 left-0 text-red-600 text-sm">
                      {errors.password_confirmation?.message}
                    </p>
                  </div>

                  <div className="relative pt-4">
                    <label className="text-sm font-bold">Present Address</label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter present address...."
                        {...register("present")}
                      />
                    </div>
                    <div className="absolute top-[90px] md:left-0 left-0 text-red-600 text-sm">
                      {errors.present?.message}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="relative pt-4">
                    <label className="text-sm font-bold">
                      Permanent Address
                    </label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter parmanent address...."
                        {...register("permanent")}
                      />
                    </div>
                    <div className="absolute top-[90px] md:left-0 left-0 text-red-600 text-sm">
                      {errors.permanent?.message}
                    </div>
                  </div>

                  <div className="relative pt-4">
                    <label className="text-sm font-bold">Office Address</label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter office address...."
                        {...register("office")}
                      />
                    </div>
                    <div className="absolute top-[90px] md:left-0 left-0 text-red-600 text-sm">
                      {errors.office?.message}
                    </div>
                  </div>

                  <div className="relative pt-4">
                    <label className="text-sm font-bold">Website Domain</label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter website domain...."
                        {...register("domain")}
                      />
                    </div>
                    <div className="absolute top-11 md:left-0 left-0 text-red-600 text-sm">
                      {errors.domain?.message}
                    </div>
                  </div>

                  <div className="relative pt-4">
                    <label className="text-sm font-bold">Website URL</label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter website url...."
                        {...register("url")}
                      />
                    </div>
                    <div className="absolute top-11 md:left-0 left-0 text-red-600 text-sm">
                      {errors.url?.message}
                    </div>
                  </div>

                  <div className="relative pt-4">
                    <label className="text-sm font-bold">
                      NID/PASSPORT <span className="text-red-600">*</span>
                    </label>
                    <div className="w-full pt-2">
                      <input
                        type="text"
                        className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                        placeholder="Enter NID/PASSPORT....."
                        {...register("number")}
                      />
                    </div>
                    <div className="absolute top-[90px] md:left-0 left-0 text-red-600 text-sm">
                      {errors.number?.message}
                    </div>
                  </div>

                  <div>
                    <div className="pt-4 flex space-x-2 items-center">
                      <div className="flex flex-wrap">
                        {images.map((file, index) => (
                          <div key={index} className="preview m-2 relative">
                            <img
                              src={file}
                              alt={`Preview ${index}`}
                              className="w-32 h-32 object-cover rounded-md"
                            />

                            <TiDeleteOutline
                              className="text-red-600 absolute top-0 right-0 cursor-pointer"
                              size={25}
                              onClick={() => removeImage(index)}
                            />
                          </div>
                        ))}
                      </div>
                      {/* <div
                        {...getRootProps()}
                        className="dropzone p-2 border border-dashed border-gray-400 rounded-md text-center cursor-pointer h-32 w-32"
                      >
                        <input {...getInputProps()} />

                        <div>
                          <p className="text-sm">Upload </p>
                          <p className="text-sm text-red-500">Doc Image</p>
                        </div>
                      </div> */}
                    </div>

                    <div className="flex space-x-2 items-center pt-3">
                      <SingleNidImageUpload
                        nidImage={nidImage}
                        setNidImage={setNidImage}
                      />

                      <SingleProfileImageUpload
                        profileImage={profileImage}
                        setProfileImage={setProfileImage}
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-500 text-center mt-4 text-white font-bold py-3 uppercase"
                >
                  Apply
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
