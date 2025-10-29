import request from '../../lib/request';
import BreadCrumbs from '../components/Common/Breadcumb';
import ProductSection from '../components/ProductSection/ProductSection';



async function getFeatureProducts() {
  try {
    let res = await request(
      `product/admin-customer/feature-products?page=1&limit=24
`,
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

const FeatureProducts = async() => {
 
    const product = await getFeatureProducts();
 

     const breadCumbs = [{ name: "Home", url: "/" }, { name: `feature-products` }];
 
  return (
    <div className="bg-white text-black">
      <div className="bg-gray-200 py-4 px-8">
        <BreadCrumbs breadCumbs={breadCumbs} />
      </div>
      <div className="max-w-7xl mx-auto">
        <ProductSection
          item={product?.data?.data}
          apititle={`feature-products`}
          totalData={product?.data?.metaData?.totalData}
        />
      </div>
    </div>
  );
}

export default FeatureProducts