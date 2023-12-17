module.exports = {
  getImgUrl,
  getMetadataJson,
};

const crypto = require("crypto");
const { env } = require("process");
const { URLSearchParams } = require("url");

const NET = env.CARDANO_NETWORK ?? "mainnet";
const KEY = Buffer.from(env.NFTCDN_KEY, "base64");

/**
 * Get the image nftcdn.io URL of an asset.
 * @param {string} fingerprint (Eg. `asset1..`)
 * @returns Image nftcdn.io URL
 */
async function getImgUrl(fingerprint) {
  return _nftcdnUrl(NET, KEY, fingerprint, "/image");
}

/**
 * Get the asset metadata from nftcdn.io
 * @param {string} fingerprint (Eg. `asset1..`)
 * @returns Metadata of the asset
 */
async function getMetadataJson(fingerprint) {
  const metadataUrl = _nftcdnUrl(NET, KEY, fingerprint, "/metadata");
  const metadata = await fetch(metadataUrl);
  return await metadata.json();
}

function _nftcdnUrl(domain, key, token, uri, params = {}) {
  params.tk = "";
  let url = _buildUrl(domain, token, uri, params);
  // base64url codec requires Node.js >= 16, else 3rd party libraries can be used
  params.tk = crypto.createHmac("sha256", key).update(url).digest("base64url");
  return _buildUrl(domain, token, uri, params);
}

function _buildUrl(domain, token, uri, params) {
  const searchParams = new URLSearchParams(params);
  return `https://${token}.${domain}.nftcdn.io${uri}?${searchParams.toString()}`;
}
