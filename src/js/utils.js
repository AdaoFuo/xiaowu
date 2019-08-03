import Vue from 'vue'
import CryptoJS from 'crypto-js'
// 默认的 KEY 与 iv 如果没有给
const KEY = CryptoJS.enc.Utf8.parse("8a7cd3044f354684");
const IV = CryptoJS.enc.Utf8.parse('8a7cd3044f354684');

export default {

  encrypt (word, keyStr, ivStr) { // 加密

    let key = KEY
    let iv = IV

    if (keyStr) {
      key = CryptoJS.enc.Utf8.parse(keyStr);
      iv = CryptoJS.enc.Utf8.parse(ivStr);
    }

    let srcs = CryptoJS.enc.Utf8.parse(word);
    var encrypted = CryptoJS.AES.encrypt(srcs, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    });
    // console.log("-=-=-=-", encrypted.ciphertext)
    return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

  },

  decrypt (word, keyStr, ivStr) { // 解密

    let key  = KEY
    let iv = IV

    if (keyStr) {
      key = CryptoJS.enc.Utf8.parse(keyStr);
      iv = CryptoJS.enc.Utf8.parse(ivStr);
    }

    let base64 = CryptoJS.enc.Base64.parse(word);
    let src = CryptoJS.enc.Base64.stringify(base64);

    var decrypt = CryptoJS.AES.decrypt(src, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.ZeroPadding
    });

    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();

  }

}
