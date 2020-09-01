const monerojs = require("monero-javascript");
import sha256 from "crypto-js/sha256";

export async function createWallet(lang = "English") {
  console.log("Creating new wallet");
  let walletWasm = await monerojs.createWalletWasm({
    networkType: "stagenet",
    language: lang,
    password: "penis",
    serverUri: "http://stagenet.community.xmr.to:38081",
  });
  return walletWasm;
}

export async function openWalletFromSeed(seed) {
  let walletWasm = await monerojs.createWalletWasm({
    networkType: "stagenet",
    mnemonic: seed,
    password: "penis",
    serverUri: "http://stagenet.community.xmr.to:38081",
  });
  return walletWasm;
}

export async function getPrimaryAddress(walletWasm) {
  return await walletWasm.getPrimaryAddress();
}

export async function createSubaddress(walletWasm) {
  return await walletWasm.createSubaddress(0, "");
}

export async function getMnemonic(walletWasm) {
  return await walletWasm.getMnemonic();
}

export function getMnemonicHash(seed) {
  return sha256(seed);
}

export default {
  createWallet,
  openWalletFromSeed,
  getPrimaryAddress,
  createSubaddress,
  getMnemonic,
  getMnemonicHash,
};
