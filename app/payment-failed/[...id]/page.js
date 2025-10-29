
import { MdOutlineCancel } from "react-icons/md";
import Link from "next/link";
import request from "@/lib/request";


async function getOrderInfo(id) {
  try {
    let res = await request(`admin-order/customer/single-order/${id}`);
    if (res) {
      return res?.data?.data;
    }
  } catch (error) {
    console.log("err in order details on success page", error);
  }
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

const PaymentSuccessful =async (params) => {
 
  const orderInfo = await getOrderInfo(params.params.id[0]);

  return (
    <div className="min-h-[670px] bg-gray-100">
      <div className="max-w-7xl sm:max-w-[40rem] xls:mx-w-[24rem] xms:max-w-[22rem] xs:max-w-[16rem] mx-auto h-full font-sans">
        <div className="flex justify-center items-center h-full pt-28 xls:pt-16 xms:pt-16 xs:pt-10">
          <div className="space-y-3">
            <div className="flex justify-center">
              <MdOutlineCancel size={40} className="text-red-500 " />
            </div>
            <div className="text-center dark:text-black">
              প্রিয় , {orderInfo?.deliveryAddress?.name}
            </div>
            <div className="text-center text-black">
              আপনার অর্ডারটি গ্রহন করা হয়েছে কিন্তু আপনার পেমেন্ট ফেইল হয়ে
              গিয়েছে ।
            </div>
            <div className="text-center text-black">
              আপনার অর্ডার নাম্বার - {orderInfo?.serialId}
            </div>
            <div className="text-center text-black">
              এবং পণ্যের মূল্য -
              <span className="font-semibold">
                {" "}
                {orderInfo?.customerCharge?.totalBill}
              </span>{" "}
              টাকা
            </div>
            <h6 className="text-center text-black">ধন্যবাদান্তে</h6>

            <h6 className="text-center text-black cursor-pointer hover:text-blue-700">
              Ahbab
            </h6>
          </div>
        </div>
        <Link className="flex justify-center mt-10" href={`/`}>
          <button className="bg-green-600 text-white text-base px-4 py-2 rounded-md uppercase">
            Continue Shopping
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PaymentSuccessful;
