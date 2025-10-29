import React from 'react';
import BrandList from '../components/update/BrandList/BrandList';
import request from '@/lib/request';
import { getData } from '../layout';
import { baseUrl, imageBasePath } from '@/config';

async function getBrandList() {
  try {
    let res = await request(`brand/fetch-all`);
    return res;
  } catch (error) {
    console.log("err in get brands", error);
    return null;
  }
}

export async function generateMetadata() {
  const siteData = await getData();
  const title = `All Brands - ${siteData?.data?.data?.shopName}` || "All Brands";
  const faviconUrl = `${imageBasePath}/${siteData?.data?.data?.favIcon}`;

  return {
    title: title,
    description: "Browse all our brands",
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: title,
      description: "Browse all our brands",
      url: `${baseUrl}/brands`,
      siteName: siteData?.data?.data?.shopName || "Default Site Name",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: "Browse all our brands",
      site: "@YourTwitterHandle",
    },
    viewport: "width=device-width, initial-scale=1",
  };
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function BrandsPage() {
  const brands = await getBrandList();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <BrandList />
    </div>
  );
} 