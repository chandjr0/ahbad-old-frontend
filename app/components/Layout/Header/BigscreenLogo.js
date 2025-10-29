import { imageBasePath } from "@/config";
import request from "@/lib/request";
import Image from "next/image";
import Link from "next/link";
import React from "react"; 


async function getHomeSettings() {
  try {
    let res = await request(`setting/admin/site-view`);
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("err in get settings", error);
  }
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

const BigscreenLogo = async () => {
  const homeSettings = await getHomeSettings();
  return (
    <Link href={'/'}>
      {homeSettings?.data?.data?.logoImg ? (
        <Image
          alt="logo"
          width={0}
          height={0}
          priority
          sizes={100}
          src={`${imageBasePath}/${homeSettings?.data?.data?.logoImg}`}
          className="w-[237px] h-[67.71px] "
        />
      ) : (
        <Image
          alt="logo"
          width={0}
          height={0}
          priority
          sizes={100}
          src="/image/placeholderImage.png"
          className="w-[237px] h-[67.71px] "
        />
      )}
    </Link>
  );
};

export default BigscreenLogo;
