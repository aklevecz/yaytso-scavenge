export const IPFS_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8082/ipfs/"
    : "https://ipfs.io/ipfs/";
