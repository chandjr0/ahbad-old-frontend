import Link from "next/link";
import React from "react";

const FooterLinks = () => {
  return (
    <div>
      <p className="text-lg"> Important Links </p>
      <ul className="mt-4 space-y-3">
      
        <li>
          <Link href="/refund-and-returned">
            <p className="text-sm font-semibold text-white hover:text-orange-600 duration-300">
              Refund & Returned
            </p>
          </Link>
        </li>

        <li>
          <Link href="/about-us">
            <p className="text-sm font-semibold text-white hover:text-orange-600 duration-300">
              About Us
            </p>
          </Link>
        </li>

        <li>
          <Link href="/privacy-policy">
            <p className="text-sm font-semibold text-white hover:text-orange-600 duration-300">
              Privacy Policy
            </p>
          </Link>
        </li>

        <li>
          <Link href="/terms-and-conditions">
            {" "}
            <pnk className="text-sm font-semibold text-white hover:text-orange-600 duration-300">
              Terms & Conditions
            </pnk>
          </Link>
        </li>
        {/* <li>
          <div href="/showroom-list">
            {" "}
            <p className="text-sm font-semibold text-white hover:text-orange-600 duration-300">
              blog
            </p>
          </div>
        </li> */}
      </ul>
    </div>
  );
};

export default FooterLinks;
