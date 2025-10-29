import request from "../../lib/request";

async function getHomeSettings() {
  try {
    let res = await request(`setting/admin/site-view`);
    if (res) {
      return res?.data?.data;
    }
  } catch (error) {
    console.log("err in get settings", error);
  }
}

export default async function MetaPixel() {
  const homeSettings = await getHomeSettings();

  return (
    <>
      <script>
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init',${homeSettings?.allScript?.fbScript?.header});
fbq('track', 'PageView');`}
      </script>

      {/* <script>{`${homeSettings?.allScript?.fbScript?.body}`}</script> */}
    </>
  );
}
