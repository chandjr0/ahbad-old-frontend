import Skeleton from "react-loading-skeleton";

export default function loading() {
  return (
    <div className=" bg-white ">
      <div className="max-w-7xl mx-auto shadow-lg px-4 pb-5 min-h-[600px]">
        <div className="grid grid-cols-12 gap-3">
          <div className="p-2 col-span-6 xls:col-span-full xms:col-span-full xs:col-span-full">
            <div>
              <Skeleton height={400} />
            </div>

            <div className="mt-2 grid grid-cols-5 gap-5 pt-4">
              <div>
                <Skeleton height={70} />
              </div>
              <div>
                <Skeleton height={70} />
              </div>
              <div>
                <Skeleton height={70} />
              </div>
              <div>
                <Skeleton height={70} />
              </div>
              <div>
                <Skeleton height={70} />
              </div>
            </div>
          </div>
          <div className="col-span-6 xls:col-span-full xms:col-span-full xs:col-span-full">
            <div>
              <Skeleton height={50} />
            </div>
            <div className="mt-3">
              <Skeleton height={30} />
            </div>

            <div className="mt-5">
              <Skeleton height={100} width={200} />
            </div>
            <div className="mt-3">
              <Skeleton height={30} />
            </div>
            <div className="mt-3">
              <Skeleton height={30} />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="mt-3">
                <Skeleton height={30} />
              </div>
              <div className="mt-3">
                <Skeleton height={30} />
              </div>
              <div className="mt-3">
                <Skeleton height={30} />
              </div>
            </div>
            <div className="mt-5">
              <Skeleton height={150} width={400} />
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
