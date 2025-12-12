import DescriptionDetails from "@/app/components/ProductDetails/DescriptionDetails";
import DetailsSection from "@/app/components/ProductDetails/Detailssection";
import ImageGallery from "@/app/components/ProductDetails/ImageGallery";
import RelatedProduct from "@/app/components/ProductDetails/RelatedProduct";
import DetailsMain from "@/app/components/update/productDetails/DetailsMain";
import Gtm from "@/app/Gtm";
import { baseUrl, imageBasePath } from "@/config";
import request from "@/lib/request";
import { notFound } from "next/navigation";

async function getProductDetails(slug) {
  try {
    let res = await request(
      `product/admin-customer/view-with-similar/${slug}?similarLimit=12`
    );
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("err in getProducts", error);
  }
}

// Function to get the best product image for sharing
function getProductImage(product) {
  // First, check if galleryImage exists and has images
  if (product?.galleryImage && product.galleryImage.length > 0) {
    return `${imageBasePath}/${product.galleryImage[0]}`;
  }
  
  // If no gallery images but it's a variant product, get first variation image
  if (product?.isVariant && product.variations && product.variations.length > 0) {
    // Look through all variations to find one with images
    for (const variation of product.variations) {
      if (variation.images && variation.images.length > 0) {
        return `${imageBasePath}/${variation.images[0]}`;
      }
    }
  }
  
  // Fallback to a default image if nothing else is available
  return `${baseUrl}/image/logo.png`;
}

export default async function ProductDetails(params) {
  const productInfo = await getProductDetails(params.params.slug);

  if (!productInfo) {
    notFound();
  }

  // Get the best image for SEO
  const productImage = getProductImage(productInfo?.data?.data);

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
        <DetailsMain info={productInfo?.data?.data} />
      </div>
    </>
  );
}
