export default function Custom404() {
  return (
    <div className="min-h-[550px]">
      <div className="flex justify-center items-center font-body pt-20">
        <div className="space-y-6">
          <div>
            {" "}
            <div className="w-96 mx-auto flex justify-center">
              {/* <Lottie loop={true} animationData={PageNotFound} /> */}
              <span className="font-bold text-4xl text-black">
                No Data Found
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
