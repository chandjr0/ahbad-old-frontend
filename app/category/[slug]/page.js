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
