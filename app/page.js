import Slider from "./components/Home/Slider";
import request from "../lib/request";
import BestDeals from "./components/ProductSection/BestDeals";
import CategoryProduct from "./components/ProductSection/CategoryProduct";
import FeatureProduct from "./components/ProductSection/FeatureProduct";
import HotDetails from "./components/ProductSection/HotDetails";
import PopUpModal from "./components/popUpModal";
import { baseUrl, imageBasePath } from "@/config";
import { getData } from "./layout";

import ComboProducts from "./components/ProductSection/comboProducts";

import Categorysection from "./components/Categorysection";
import HeroSection from "./components/update/landing-page/hero-section/HeroSection";
import CategoryWiseProduct from "./components/update/categoryWiseProduct/CategoryWiseProduct";
import SliderSection from "./components/update/landing-page/slider-section/SliderSection";
import BigSales from "./components/update/landing-page/big-sales/BigSales";
import ReviewSection from "./components/update/review/ReviewSection";
import Caption from "./components/update/landing-page/caption/Caption";
import FeaturedCategory from "./components/update/landing-page/category/FeaturedCategory";
import BrandList from "./components/update/BrandList/BrandList";


async function getHomeSettings() {
  try {
    let res = await request(`home/fetch-products?inWhere=web`);
    return res;
  } catch (error) {
    console.log("err in get settings", error);
  }
}
async function getNewArrivals() {
  try {
    let res = await request(`product/admin-customer/new-arrival-products?page=1&limit=12`);
    return res;
  } catch (error) {
    console.log("err in get settings", error);
  }
}

export async function generateMetadata() {
  const siteData = await getData();
  const title =
    `${siteData?.data?.data?.shopName} - ${siteData?.data?.data?.subTitle}` ||
    "Default Title";
  const faviconUrl = `${imageBasePath}/${siteData?.data?.data?.favIcon}`;
  const bannerImgUrl = `${imageBasePath}/${siteData?.data?.data?.sliderImgs?.[0]?.image}`;

  return {
    title: title,
    description: title,
    icons: {
      icon: faviconUrl,
      apple: faviconUrl,
    },
    openGraph: {
      title: title,
      description: title,
      images: [bannerImgUrl],
      url: baseUrl,
      siteName: siteData?.data?.data?.shopName || "Default Site Name",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: title,
      images: [bannerImgUrl],
      site: "@YourTwitterHandle",
    },
    viewport: "width=device-width, initial-scale=1",
  };
}

async function brandList() {
  try {
    let res = await request(`brand/fetch-all`);
    return res;
  } catch (error) {
    console.log("err in get settings", error);
  }
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

export default async function Home(params) {
  const [homeSettings, slider, newArrivals] = await Promise.all([
    getHomeSettings().catch((error) => {
      console.error("Error fetching home settings:", error);
      return null;
    }),
    getData().catch((error) => {
      console.error("Error fetching data:", error);
      return null;
    }),
    getNewArrivals().catch((error) => {
      console.error("Error fetching new arrivals:", error);
      return null;
    }),
  ]);

  // Filter valid category products that have products
  const validCategoryProducts = homeSettings?.data?.data?.categoryProducts?.filter(
    item => item?.products?.length > 0
  ) || [];

  // Calculate the midpoint to split the array
  const midPoint = Math.ceil(validCategoryProducts.length / 2);

  // Split the categories into two parts
  const firstHalfCategories = validCategoryProducts.slice(0, midPoint);
  const secondHalfCategories = validCategoryProducts.slice(midPoint);

  return (
    <>
      <div className="relative bg-[#E6E6E6]">
        <HeroSection slider={slider?.data?.data} />

        <div className="globalPadding mt-8">
          <Categorysection
            categoryData={homeSettings?.data?.data?.categoryData}
          />
        </div>

        <div className="">
          <CategoryWiseProduct
            title={"New Arrivals"}
            slug={"new-arrival"}
            item={newArrivals?.data?.data}
            type={true}
          />
        </div>

        {/* First half of category products */}
        <div className="">
          {firstHalfCategories.map(
            (item, index) => (
              <CategoryWiseProduct
                key={`first-${index}`}
                title={item?.name}
                slug={item?.slug}
                item={item?.products}
              />
            )
          )}
        </div>

        {/* Featured category in the middle */}
        {homeSettings?.data?.data?.topFiveFeaturedCategory?.length > 0 && (
          <div>
            <FeaturedCategory
              data={homeSettings?.data?.data?.topFiveFeaturedCategory}
            />
          </div>
        )}

        {/* Second half of category products */}
        <div className="">
          {secondHalfCategories.map(
            (item, index) => (
              <CategoryWiseProduct
                key={`second-${index}`}
                title={item?.name}
                slug={item?.slug}
                item={item?.products}
              />
            )
          )}
        </div>

        <BrandList />
      </div>
    </>
  );
}
