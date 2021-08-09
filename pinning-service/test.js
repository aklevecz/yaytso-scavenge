require("dotenv").config();
const { NFTStorage, File, Blob } = require("nft.storage");
const token = process.env.NFT_STORAGE_TOKEN;
const client = new NFTStorage({ token });
client
  .storeDirectory([
    new File(["hello world"], "hello.txt"),
    new File([JSON.stringify({ from: "incognito" }, null, 2)], "metadata.json"),
  ])
  .then(console.log);
