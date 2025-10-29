export default async function generateFbp() {
  function getRandomNumber(min, max) {
    return Math.floor(Math.random() * 900000000 + 100000000);
  }
  const randomNumber = getRandomNumber(1, 101);
  const current_timestamp = Math.floor(new Date() / 1000);
  const fbp_id = `fb.1.${current_timestamp}.${randomNumber}`;
  return fbp_id;
}
