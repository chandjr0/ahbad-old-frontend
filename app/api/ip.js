export default async function findUserIpAddress() {
    try {
        const res = await fetch("https://api.ipify.org?format=json");
        const data = await res.json();
        const ip = data.ip;
        return (ip);
    } catch(error) {
        console.log(error)
    }
}

// fetch('https://api.ipify.org?format=json').then(response => {
//   return response.json();
// }).then((res) => {
//   console.log('..............res api',res);
// }).catch((err) => console.error('Problem fetching my IP', err))