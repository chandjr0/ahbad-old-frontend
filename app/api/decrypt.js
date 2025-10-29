import SimpleCrypto from "simple-crypto-js";

export default  function decryptData() {
    const secretKey = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const encryptedData = localStorage.getItem("myCartMain");
  
    if (!encryptedData) {
      return null; 
    }
  
    const simpleCrypto = new SimpleCrypto(secretKey);
    return simpleCrypto.decrypt(encryptedData);
  }
