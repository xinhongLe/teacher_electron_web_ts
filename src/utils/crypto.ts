import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Hex.parse("000102030405060708090a0b0c0d0e0f");

const iv = CryptoJS.enc.Hex.parse("101112131415161718191a1b1c1d1e1f");

// 加密
export const encrypt = (data: string) => {
    const encrypted = CryptoJS.AES.encrypt(data, key, {
        iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });

    return encrypted.toString();
};

// 解密
export const decrypt = (data: string) => {
    const decrypted = CryptoJS.AES.decrypt(data, key,
        {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });
    return decrypted.toString(CryptoJS.enc.Utf8);
};
