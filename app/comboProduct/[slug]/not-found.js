import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-white min-h-[550px] pt-16 ">
      <div className="flex justify-center h-full text-black">
        <div>
          <h2 className="text-4xl xls:text-2xl xms:text-2xl xs:text-xl font-semibold text-center">
            No data Found
          </h2>

          <Link href="/" className="flex justify-center pt-5">
            <button className="bg-secondary text-white px-3 py-2">
              Return Home
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
