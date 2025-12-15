import DescriptionDetails from "@/app/components/ProductDetails/DescriptionDetails";
import DetailsSection from "@/app/components/ProductDetails/Detailssection";
import ImageGallery from "@/app/components/ProductDetails/ImageGallery";
import RelatedProduct from "@/app/components/ProductDetails/RelatedProduct";
import DetailsMain from "@/app/components/update/productDetails/DetailsMain";
import Gtm from "@/app/Gtm";
import { baseUrl, imageBasePath } from "@/config";
import request from "@/lib/request";
import { notFound } from "next/navigation";
import { getProductImage } from "@/app/utils/getProductImage";

async function getProductDetails(slug) {
  try {
    let res = await request(
      `product/admin-customer/view-with-similar/${slug}?similarLimit=12`
    );
    if (res?.data?.success && res?.data?.data) {
      return res.data;
    }
    return null;
  } catch (error) {
    console.log("err in getProducts", error);
    return null;
  }
}


export default async function ProductDetails(params) {
  const productInfo = await getProductDetails(params.params.slug);

  if (!productInfo || !productInfo?.success || !productInfo?.data) {
    notFound();
  }

  // Get the best image for SEO
  const productImage = getProductImage(productInfo?.data);

  return (
    <>
      {/* <div className="bg-white text-black pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 xls:grid-cols-1 xms:grid-cols-1 xs:grid-cols-1 gap-8  sm:gap-4 xls:gap-0 xms:gap-0 xs:gap-0  pt-8">
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
      </div> */}

      {/* <Gtm
        data={{
          event: "view_item",
          eventID: 12121,
          plugin: "StoreX",
          currency: "BD",
          value: null,
          customer: {
            id: 0,
            billing: {
              first_name: "",
              last_name: "",
              company: "",
              address_1: "",
              address_2: "",
              city: "",
              zone: "",
              postcode: "",
              country: "BD",
              email: "",
              phone: "",
            },
          },
          items: [
            {
              item_id: "",
              item_name: "",
              discount: "",
              index: 0,
              item_brand: "",
              item_category: "",
              price: "",
              quantity: null,
            },
          ],
        }}
      /> */}
      <div>
        <DetailsMain info={productInfo?.data} />
      </div>
    </>
  );
}
