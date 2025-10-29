import { hostname } from "@/config";
import patchRequest from "@/lib/patchRequest";
import request from "@/lib/request";
import Image from "next/image";

import { useEffect, useState } from "react";

import { ThreeDots } from "react-loader-spinner";
import { toast } from "react-toastify";

const MyProfile = () => {

  const [imageUrl, setimageUrl] = useState("");
  const [userProfileData, setUserProfileData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isAlive, setIsAlive] = useState(false);

  const [name, setName] = useState();
  const [addresses, setAddresses] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleName = (value) => {
    setName(value);
  };

  const handleAddress = (value) => {
    setAddresses(value);
  };

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handlePicChange = async (data) => {
    let file = data[0];
    const base64 = await convertBase64(file);
    setimageUrl(base64);
  };

  useEffect(() => {
    const getData = async () => {
      let res = await request(`customer/admin/profile-view`);

      setUserProfileData(res?.data?.data);
      setLoading(false);
    };
    getData();
  }, [isAlive]);

  const handleAdd = async () => {
    let validate = false;

    if (validate == false) {
      setIsLoading(true);

      const res = await patchRequest(`customer/admin/update`, {
        name: name ? name : userProfileData?.name,
        address: addresses ? addresses  :userProfileData?.address,
        image: imageUrl ? imageUrl : userProfileData?.image,
      });

      if (res?.success) {
        toast(res?.message);
        setIsLoading(false);
        setIsAlive(!isAlive);
      } else {
        toast.error(res?.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white p-3 rounded-md">
      <div className="flex space-x-2 items-center">
        <svg
          className="fill-current text-black"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
        >
          <path fill="none" d="M0 0h24v24H0z" />
          <path d="M4 22a8 8 0 1 1 16 0h-2a6 6 0 1 0-12 0H4zm8-9c-3.315 0-6-2.685-6-6s2.685-6 6-6 6 2.685 6 6-2.685 6-6 6zm0-2c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" />
        </svg>
        <h1 className="font-semibold text-2xl">
          <span className="text-black">Profile</span>{" "}
        </h1>
      </div>
      <div className="p-3 rounded-md">
        <div>
          <div>
            <div className="py-4 w-[200px]">
              <label className="text-black">Your Profile Image</label>
              <input
                type="file"
                accept="image/png, image/gif, image/jpeg"
                onChange={(e) => handlePicChange(e.target.files)}
              />
              {imageUrl ? (
                <div className="py-2">
                  <Image alt="image" width={80} height={80} src={imageUrl} />
                </div>
              ) : loading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: "170px",
                  }}
                >
                  {" "}
                  <ThreeDots
                    height="30"
                    width="80"
                    radius="9"
                    color="#1F2937"
                    ariaLabel="three-dots-loading"
                    wrapperStyle={{}}
                    visible={true}
                  />
                </div>
              ) : userProfileData == undefined ||
                userProfileData?.image == "" ? null : (
                <div className="mt-2">
                  <img
                    src={`${hostname}/${userProfileData?.image}`}
                    className="h-[150px] w-[150px]"
                  />
                </div>
              )}
            </div>

            <div className="w-full">
              <p className="text-sm font-normal  py-2 text-black">Name</p>
              <input
                className="border h-[40px] w-full pl-2 rounded-md outline-none bg-white text-black border border-gray-300"
                placeholder="Enter name..."
                defaultValue={userProfileData?.name}
                onChange={(e) => handleName(e.target.value)}
              />
            </div>

            <div className="w-full mt-3">
              <label
                for="message"
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
              >
                Address details
              </label>
              <textarea
                id="message"
                rows="4"
                defaultValue={addresses ? addresses : userProfileData?.address}
                onChange={(e) => handleAddress(e.target.value)}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-white dark:border-gray-600 dark:placeholder-gray-400 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500"
              ></textarea>
            </div>
          </div>
          <div className="mt-2 flex justify-end">
            {isLoading == true ? (
              <button className="bg-secondary  text-white hover:bg-purple-400 px-8 py-1 rounded-md cursor-pointer flex space-x-1 disabled">
                <svg
                  className="fill-current text-white animate-spin h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C12.5523 2 13 2.44772 13 3V6C13 6.55228 12.5523 7 12 7C11.4477 7 11 6.55228 11 6V3C11 2.44772 11.4477 2 12 2ZM12 17C12.5523 17 13 17.4477 13 18V21C13 21.5523 12.5523 22 12 22C11.4477 22 11 21.5523 11 21V18C11 17.4477 11.4477 17 12 17ZM22 12C22 12.5523 21.5523 13 21 13H18C17.4477 13 17 12.5523 17 12C17 11.4477 17.4477 11 18 11H21C21.5523 11 22 11.4477 22 12ZM7 12C7 12.5523 6.55228 13 6 13H3C2.44772 13 2 12.5523 2 12C2 11.4477 2.44772 11 3 11H6C6.55228 11 7 11.4477 7 12ZM19.0711 19.0711C18.6805 19.4616 18.0474 19.4616 17.6569 19.0711L15.5355 16.9497C15.145 16.5592 15.145 15.9261 15.5355 15.5355C15.9261 15.145 16.5592 15.145 16.9497 15.5355L19.0711 17.6569C19.4616 18.0474 19.4616 18.6805 19.0711 19.0711ZM8.46447 8.46447C8.07394 8.85499 7.44078 8.85499 7.05025 8.46447L4.92893 6.34315C4.53841 5.95262 4.53841 5.31946 4.92893 4.92893C5.31946 4.53841 5.95262 4.53841 6.34315 4.92893L8.46447 7.05025C8.85499 7.44078 8.85499 8.07394 8.46447 8.46447ZM4.92893 19.0711C4.53841 18.6805 4.53841 18.0474 4.92893 17.6569L7.05025 15.5355C7.44078 15.145 8.07394 15.145 8.46447 15.5355C8.85499 15.9261 8.85499 16.5592 8.46447 16.9497L6.34315 19.0711C5.95262 19.4616 5.31946 19.4616 4.92893 19.0711ZM15.5355 8.46447C15.145 8.07394 15.145 7.44078 15.5355 7.05025L17.6569 4.92893C18.0474 4.53841 18.6805 4.53841 19.0711 4.92893C19.4616 5.31946 19.4616 5.95262 19.0711 6.34315L16.9497 8.46447C16.5592 8.85499 15.9261 8.85499 15.5355 8.46447Z"></path>
                </svg>
                <p>Updating...</p>
              </button>
            ) : (
              <button
                className="bg-secondary  text-white  px-8 py-1 rounded-md cursor-pointer"
                onClick={handleAdd}
              >
                Update
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
