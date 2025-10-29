import React from "react";

const FooterContact = ({settingsData}) => {
  return (
    <ul className="mt-4 space-y-3">
      <li className="text-sm">
        Address:{" "}
        <p className="font-semibold text-base leading-5">
          {settingsData?.address?.house},{settingsData?.address?.road},
          {settingsData?.address?.union},{settingsData?.address?.district},
          {settingsData?.address?.zipCode}
        </p>
      </li>
      <li className="text-sm">
        Call us:{" "}
        <p className="font-semibold text-base leading-5">
          {settingsData?.phone}
        </p>
      </li>
      <li className="text-sm">
        Email us:{" "}
        <p className="font-semibold text-base leading-5">
          {settingsData?.email}
        </p>
      </li>
    </ul>
  );
};

export default FooterContact;
