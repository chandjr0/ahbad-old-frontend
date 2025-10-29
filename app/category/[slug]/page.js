import Breadcumb from "@/app/components/Common/Breadcumb";
import ProductSectionSlug from "@/app/components/ProductSection/ProductSectionSlug";
import request from "@/lib/request";
import { getData } from "@/app/layout";
import { baseUrl, imageBasePath } from "@/config";
import PageView from "@/app/api/conversion/PageView";


export const getCategories = async () => {
  try {
    let res = await request(`category/fetch-all`);
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("err in get cat wise Products", error);
  }
};

const CategoryWiseProduct = async (params) => {
  // Getting meta data
  const siteData = await getData();
  const allCategories = await getCategories();
  const category =
    allCategories?.data?.data &&
    allCategories?.data?.data.find((category) => {
      return category.slug === params.params.slug;
    });

  const breadCumbs = [
    { name: "Home", url: "/" },
    {
      name: "category",
      url: "/category",
    },
    { name: `${params.params.slug}`, url: `/${params.params.slug}` },
  ];


  return (
    <>
      <head>
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={params.params.slug} />
        <meta
          property="og:description"
          content={`${siteData?.data?.data?.shopName} - ${siteData?.data?.data?.subTitle}`}
        />
        <meta
          property="og:image"
          content={`${imageBasePath}/${
            category?.image || siteData?.data?.data?.sliderImgs[0]?.image
          }`}
        />
        <meta
          property="og:url"
          content={`${baseUrl}/category/${params.params.slug}`}
        />
        <meta property="og:type" content="website" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:title" content={params.params.slug} />
        <meta
          name="twitter:description"
          content={`${siteData?.data?.data?.shopName} - ${siteData?.data?.data?.subTitle}`}
        />
        <meta
          name="twitter:image"
          content={`${imageBasePath}/${
            category?.image || siteData?.data?.data?.sliderImgs[0]?.image
          }`}
        />
        <meta name="twitter:site" content="@mywebsite" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>

      <PageView />

      <div>
        <div className="bg-[#E5E7EB]">
          <div className="base-container hidden lg:block">
            <div className=" breadcrumbs text-sm !py-3">
              <Breadcumb breadCumbs={breadCumbs} />
            </div>
          </div>

          {/* <div className="max-w-7xl sm:max-w-[45rem]  xls:max-w-[25rem] xms:max-w-[21rem] xs:max-w-[18rem] mx-auto">
          <ProductSectionSlug params={params} />
        </div> */}
        </div>



        <div className="mt-4 base-container">
          <ProductSectionSlug params={params} />
        </div>
      </div>
    </>
  );
};

export default CategoryWiseProduct;
