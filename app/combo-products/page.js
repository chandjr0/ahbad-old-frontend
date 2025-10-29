import request from "../../lib/request";
import BreadCrumbs from "../components/Common/Breadcumb";
import ComboProductSection from "../components/ProductSection/ComboProductSection";

async function getComboProducts() {
  try {
    let res = await request(`combo/admin-customer/list?page=1&limit=10`, {
      next: {
        revalidate: 0,
      },
    });
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("err in get settings", error);
  }
}

const BestProducts = async () => {
  const product = await getComboProducts();
  const breadCumbs = [{ name: "Home", url: "/" }, { name: `combo-products` }];

  return (
    <div className="bg-white text-black">
      <div className="bg-gray-200 py-4 px-8">
        <BreadCrumbs breadCumbs={breadCumbs} />
      </div>
      <div className="max-w-7xl mx-auto">
        <ComboProductSection
          item={product?.data?.data}
          dataa={product?.data}
          totalData={product?.data?.metaData?.totalData}
        />
      </div>
    </div>
  );
};

export default BestProducts;
