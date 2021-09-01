export const IPFS_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8080/ipfs"
    : "https://ipfs.io/ipfs";
