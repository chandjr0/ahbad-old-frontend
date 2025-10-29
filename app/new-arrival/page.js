import request from "../../lib/request";
import BreadCrumbs from "../components/Common/Breadcumb";
import ProductSection from "../components/ProductSection/ProductSection";


async function getBestProducts() {
  try {
    let res = await request(
      `product/admin-customer/new-arrival-products?page=1&limit=100`,
      {
        next: {
          revalidate: 1,
        },
      }
    );
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("err in get settings", error);
  }
}

const BestProducts = async () => {
  const product = await getBestProducts();

  const breadCumbs = [{ name: "Home", url: "/" }, { name: `new-arrival` }];

  return (
    <div className="bg-white text-black">
      <div className="bg-gray-200 py-4 px-8">
        <BreadCrumbs breadCumbs={breadCumbs} />
      </div>
      <div className="base-container">
        <ProductSection
          item={product?.data?.data}
          apititle={`best-products`}
          totalData={product?.data?.metaData?.totalData}
        />
      </div>
    </div>
  );
};

export default BestProducts;
