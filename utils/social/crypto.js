const RSA_PARAMS = {
  name: "RSA-OAEP",
  modulusLength: 2048,
  publicExponent: new Uint8Array([1, 0, 1]),
  hash: "SHA-256",
};
const AES_PARAMS = {
  name: "AES-GCM",
  length: 256,
};
export const generateKeyPair = async () => {
  const keyPair = await window.crypto.subtle.generateKey(
    RSA_PARAMS,
    true,
    ["encrypt", "decrypt"],
  );
  return keyPair;
};
export const exportPublicKey = async (key) => {
  const exported = await window.crypto.subtle.exportKey("spki", key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
};
export const importPublicKey = async (pemContents) => {
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    "spki",
    binaryDer,
    RSA_PARAMS,
    true,
    ["encrypt"],
  );
};
export const exportPrivateKey = async (key) => {
  const exported = await window.crypto.subtle.exportKey("pkcs8", key);
  return btoa(String.fromCharCode(...new Uint8Array(exported)));
};
export const importPrivateKey = async (pemContents) => {
  const binaryDer = Uint8Array.from(atob(pemContents), (c) => c.charCodeAt(0));
  return await window.crypto.subtle.importKey(
    "pkcs8",
    binaryDer,
    RSA_PARAMS,
    true,
    ["decrypt"],
  );
};
export const encryptMessage = async (message, receiverPublicKey) => {
  const aesKey = await window.crypto.subtle.generateKey(AES_PARAMS, true, [
    "encrypt",
    "decrypt",
  ]);
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(message);
  const cipherBuffer = await window.crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    aesKey,
    encoded,
  );
  const rawAesKey = await window.crypto.subtle.exportKey("raw", aesKey);
  const encryptedAesKey = await window.crypto.subtle.encrypt(
    { name: "RSA-OAEP" },
    receiverPublicKey,
    rawAesKey,
  );
  return {
    cipherText: btoa(String.fromCharCode(...new Uint8Array(cipherBuffer))),
    iv: btoa(String.fromCharCode(...new Uint8Array(iv))),
    encryptedKey: btoa(String.fromCharCode(...new Uint8Array(encryptedAesKey))),
  };
};
export const decryptMessage = async (payload, privateKey) => {
  const { cipherText, iv, encryptedKey } = payload;
  const encryptedAesKeyBuffer = Uint8Array.from(atob(encryptedKey), (c) =>
    c.charCodeAt(0),
  );
  const rawAesKey = await window.crypto.subtle.decrypt(
    { name: "RSA-OAEP" },
    privateKey,
    encryptedAesKeyBuffer,
  );
  const aesKey = await window.crypto.subtle.importKey(
    "raw",
    rawAesKey,
    AES_PARAMS,
    true,
    ["decrypt"],
  );
  const cipherBuffer = Uint8Array.from(atob(cipherText), (c) =>
    c.charCodeAt(0),
  );
  const ivBuffer = Uint8Array.from(atob(iv), (c) => c.charCodeAt(0));
  const decrypted = await window.crypto.subtle.decrypt(
    { name: "AES-GCM", iv: ivBuffer },
    aesKey,
    cipherBuffer,
  );
  return new TextDecoder().decode(decrypted);
}