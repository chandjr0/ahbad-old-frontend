import React from "react";
import { useDropzone } from "react-dropzone";
import { TiDeleteOutline } from "react-icons/ti";

const SingleProfileImageUpload = ({ profileImage, setProfileImage }) => {
  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result );
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setNidImage(null);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop,
    multiple: false,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className="border-dashed border-2 border-gray-300  cursor-pointer h-32 w-32"
      >
        <input {...getInputProps()} />
        {!profileImage ? (
          <p className="text-center text-sm text-gray-400">
            Upload Profile Image
          </p>
        ) : (
          <div className="relative">
            <img
              src={profileImage}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-md"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProfileImageUpload;
