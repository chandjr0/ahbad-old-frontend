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

export const revalidate = 0
export const dynamic = 'force-dynamic'

const SmallscreenLogo = async () => {
  
  const homeSettings = await getHomeSettings();

  return (
    <Link href={"/"}>
      {homeSettings?.data?.data?.logoImg ? (
        <Image
          alt="logo"
          width={142.5}
          height={40.71 }
          priority
          src={`${imageBasePath}/${homeSettings?.data?.data?.logoImg}`}
        />
      ) : (
        <Image
          alt="logo"
          width={120}
          height={50}
          priority
          src="/image/placeholderImage.png"
        />
      )}
    </Link>
  );
};

export default SmallscreenLogo;
