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
