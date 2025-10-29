import request from "../../lib/request";

async function getSettings() {
  try {
    let res = await request(`setting/admin/pages-view`);
    if (res) {
      return res;
    }
  } catch (error) {
    console.log("err in get settings", error);
  }
}

export const revalidate = 0;
export const dynamic = "force-dynamic";

const AboutUs = async () => {
  const settings = await getSettings();


  return (
    <div className="bg-white min-h-[670px] pt-5 xls:pt-0 xms:pt-0 xs:pt-0">
      <section>
        <div className="container px-3 py-10 mx-auto">
          <h1 className="text-4xl xls:text-2xl xms:text-2xl xs:text-2xl font-semibold text-center text-black dark:text-black ">
            About Us
          </h1>
          <div className="py-4 pt-5">
            {settings?.data?.data?.pages?.aboutUs && (
              <p
                className="text-base dark:text-black text-justify"
                dangerouslySetInnerHTML={{
                  __html: settings?.data?.data?.pages?.aboutUs,
                }}
              ></p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
