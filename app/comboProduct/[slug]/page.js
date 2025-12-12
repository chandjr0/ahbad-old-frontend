import DescriptionDetails from "@/app/components/ProductDetails/DescriptionDetails";
import DetailsSection from "@/app/components/ProductDetails/comboDetails";
import ImageGallery from "@/app/components/ProductDetails/ImageGallery";
import RelatedProduct from "@/app/components/ProductDetails/RelatedProduct";
import { baseUrl, imageBasePath } from "@/config";
import request from "@/lib/request";

import { notFound } from "next/navigation";

async function getProductDetails(slug) {
  try {
    let res = await request(
      `combo/admin-customer/view/${slug}`
    );
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("err in getProducts", error);
  }
}


export default async function ProductDetails(params) {
  
  const productInfo = await getProductDetails(params.params.slug);


  if (!productInfo) {
    notFound();
  }

  return (
    <>
      <div className="bg-white text-black pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 grid-cols-1 gap-8  sm:gap-4 xls:gap-0 xms:gap-0 xs:gap-0  pt-8">
            <div>
              <ImageGallery info={productInfo?.data?.data} />
            </div>

            <div>
              <DetailsSection info={productInfo?.data?.data} />
            </div>
          </div>

          <div className=" py-4 ">
            <DescriptionDetails info={productInfo?.data?.data} />
          </div>

          {productInfo?.data?.data?.similarProducts?.length > 0 ? (
            <div className="max-w-7xl mx-auto mt-4 pb-4">
              <RelatedProduct
                products={productInfo?.data?.data?.similarProducts}
              />
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
