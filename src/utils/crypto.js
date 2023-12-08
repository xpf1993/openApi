import CryptoJS from "crypto-js";
// 加密
function encryptAes(word, keyStr, ivStr) {
  keyStr = keyStr ? keyStr : "byby8888";
  ivStr = ivStr ? ivStr : "byby8888";
  let key = CryptoJS.enc.Utf8.parse(keyStr);
  let iv = CryptoJS.enc.Utf8.parse(ivStr);
  let srcs = CryptoJS.enc.Utf8.parse(word);
  let encrypted = CryptoJS.AES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
// 解密
function decryptAes(word, keyStr, ivStr) {
  keyStr = keyStr ? keyStr : "byby8888";
  ivStr = ivStr ? ivStr : "byby8888";
  var key = CryptoJS.enc.Utf8.parse(keyStr);
  let iv = CryptoJS.enc.Utf8.parse(ivStr);

  var decrypt = CryptoJS.AES.decrypt(
    { ciphertext: CryptoJS.enc.Base64.parse(word) },
    key,
    {
      iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    }
  );
  return decrypt.toString(CryptoJS.enc.Utf8);
}

// 加密
function encryptDes(word, keyStr, ivStr) {
  keyStr = keyStr || 'byby8888'
  ivStr = ivStr || 'byby8888'
  let key = CryptoJS.enc.Utf8.parse(keyStr)
  let iv = CryptoJS.enc.Utf8.parse(ivStr)
  let srcs = CryptoJS.enc.Utf8.parse(word)
  let encrypted = CryptoJS.DES.encrypt(srcs, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}
// 解密
function decryptDes(word, keyStr, ivStr) {
  try {
    keyStr = keyStr || 'byby8888'
    ivStr = ivStr || 'byby8888'
    var key = CryptoJS.enc.Utf8.parse(keyStr)
    let iv = CryptoJS.enc.Utf8.parse(ivStr)
    var decrypt = CryptoJS.DES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(word) }, key, {
      iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    })
    return decrypt.toString(CryptoJS.enc.Utf8)
  } catch (err) {
    return 'false'
  }
}


export { encryptAes, decryptAes, encryptDes, decryptDes };
