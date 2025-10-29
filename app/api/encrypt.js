import SimpleCrypto from "simple-crypto-js";

export default async function encryptData(data) {
  const secretKey =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const simpleCrypto = new SimpleCrypto(secretKey);
  localStorage.setItem("myCartMain", simpleCrypto.encrypt(data));
}


