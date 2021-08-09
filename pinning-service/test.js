require("dotenv").config();
const { NFTStorage, File, Blob } = require("nft.storage");
const token = process.env.NFT_STORAGE_TOKEN;
const client = new NFTStorage({ token });
console.log(token);
