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
    console.log("[product page] fetching product", { slug });
    const primary = await request(
      `product/admin-customer/view-with-similar/${slug}?similarLimit=12`
    );

    const status = primary?.status ?? null;
    const message = primary?.data?.message ?? null;

    // Handle successful response
    if (primary?.data?.success && primary?.data?.data) {
      console.log("[product page] product fetch success", {
        slug,
        status,
        hasSimilar: !!primary?.data?.data?.similarProducts?.length,
      });
      return { ...primary.data, status };
    }

    console.warn("[product page] primary fetch failed, retrying simple view", {
      slug,
      status,
      message,
      hasData: !!primary?.data,
      hasDataField: !!primary?.data?.data,
    });

    // Fallback: fetch without similar products to avoid aggregation edge cases
    const fallback = await request(`product/admin-customer/view/${slug}`);
    const fallbackStatus = fallback?.status ?? null;
    const fallbackMessage = fallback?.data?.message ?? null;

    if (fallback?.data?.success && fallback?.data?.data) {
      console.log("[product page] fallback product fetch success", {
        slug,
        status: fallbackStatus,
      });
      // Normalize shape to match primary response
      return {
        success: true,
        data: { ...fallback.data.data, similarProducts: [] },
        status: fallbackStatus,
      };
    }

    console.warn("[product page] fallback fetch failed", {
      slug,
      status: fallbackStatus,
      message: fallbackMessage,
    });

    return {
      success: false,
      data: null,
      status: fallbackStatus || status,
      message: fallbackMessage || message || "Product fetch failed",
    };
  } catch (error) {
    console.error("Error in getProductDetails:", { slug, error });
    return {
      success: false,
      data: null,
      status: null,
      message: error?.message || "Unknown fetch error",
    };
  }
}

export default async function ProductDetails(params) {
  const slug = params.params.slug;
  const productInfo = await getProductDetails(slug);

  if (!productInfo?.success || !productInfo?.data) {
    console.log("[product page] product not available", {
      slug,
      status: productInfo?.status,
      message: productInfo?.message,
    });
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
