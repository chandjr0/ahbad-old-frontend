import Skeleton from "react-loading-skeleton";

export default function loading() {
  return (
    <div className=" bg-white ">
      <div className="max-w-7xl mx-auto  px-4 pb-5 min-h-[600px]">
        <div className="grid grid-cols-5 sm:grid-cols-3 xls:grid-cols-2 xms:grid-cols-2 xs:grid-cols-2 gap-3">
          <div className="shadow-md p-2">
            <div>
              <Skeleton height={250} />
            </div>
            <Skeleton count={3} />
          </div>
          <div className="shadow-md p-2">
            <div>
              <Skeleton height={250} />
            </div>
            <Skeleton count={3} />
          </div>
          <div className="shadow-md p-2">
            <div>
              <Skeleton height={250} />
            </div>
            <Skeleton count={3} />
          </div>
          <div className="shadow-md p-2">
            <div>
              <Skeleton height={250} />
            </div>
            <Skeleton count={3} />
          </div>
          <div className="shadow-md p-2">
            <div>
              <Skeleton height={250} />
            </div>
            <Skeleton count={3} />
          </div>
        </div>
      </div>
    </div>
  );
}
