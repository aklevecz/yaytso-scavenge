import { db, YAYTSOS } from "../../firebase";

export const createBlobs = (
  gltf: object,
  desc: string,
  name: string
): FormData => {
  const gltfString = JSON.stringify(gltf);
  const gltfBlob = new Blob([gltfString], { type: "text/json" });
  const data = new FormData();
  data.append("gltf", gltfBlob);

  const metadata = { name, desc };
  data.append("metadata", JSON.stringify(metadata));

  return data;
};

export const saveYaytso = async (
  uid: string,
  metaCID: string,
  svgCID: string,
  gltfCID: string
) => {
  return db
    .collection(YAYTSOS)
    .doc(metaCID)
    .set({ uid, metaCID, svgCID, gltfCID })
    .then(() => true)
    .catch(() => false);
};
