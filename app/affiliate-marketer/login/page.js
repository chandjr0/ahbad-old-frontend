import BreadCrumbs from "@/app/components/Common/Breadcumb";
import Link from "next/link";


const Login = () => {
 
   const breadCumbs = [
     { name: "Home", url: "/" },
     { name: `affiliate-marketer-login` },
   ];

  return (
    <div>
      <div className="bg-white ">
        <div className="bg-gray-200 py-4 px-8">
          <BreadCrumbs breadCumbs={breadCumbs} />
        </div>

        <div className="max-w-7xl min-h-[500px] mx-auto text-black my-8">
          <div className="grid grid-cols-2 xls:grid-cols-1 xms:grid-cols-1 xs:grid-cols-1">
            <div className="border border-gray-200 p-8">
              <p className="text-2xl font-light py-5 uppercase">Sign In</p>

              <div>
                <div className="pt-4">
                  <label className="text-sm font-bold">
                    Mobile Number <span className="text-red-600">*</span>
                  </label>
                  <div className="w-full pt-2">
                    <input
                      type="text"
                      className="bg-white w-full pl-2 h-[45px] rounded-md outline-none text-sm text-black placeholder:text-xs placeholder-gray-400 border border-gray-400 transition-all focus:border-primary"
                      placeholder="enter your number...."
                      maxLength={11}
                    />
                  </div>
                </div>
              </div>

              <button className="w-full bg-green-500 text-center mt-4 text-white font-bold py-3 uppercase">
                Login
              </button>

              <p className="mt-3">
                <span>New Affiliate marketer?</span>{" "}
                <span className="text-green-500 font-semibold">
                  <Link href="/affiliate-marketer/apply">
                    Create an account?
                  </Link>
                </span>
              </p>
            </div>

            <div class="bg-black bg-opacity-75 relative">
              <div className="absolute top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-full grid justify-center">
                <Link
                  href={`/affiliate-marketer/apply`}
                  className=" py-3 px-20 bg-blue-700 text-white font-bold xls:text-sm xms:text-xs xs:text-xs"
                >
                  Click here to affiliate-partner Apply
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
