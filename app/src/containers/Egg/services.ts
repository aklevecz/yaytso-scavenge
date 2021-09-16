import { ethers } from "ethers";
import { Scene } from "three";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import { Egg } from "../../contexts/types";
import { EGGVG } from "./constants";
import { createBlobs, saveYaytso } from "./utils";

export const PIN_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:8082"
    : "https://pin.yaytso.art";

export const pinBlobs = (data: FormData) =>
  fetch(PIN_URL, { method: "POST", body: data })
    .then((r) => r.json())
    .then((d) => d);

export const exportYaytso = async (
  scene: Scene | undefined,
  customEgg: Egg,
  userId: string,
  successCallBack: (
    metaCID: string,
    svgCID: string,
    gltfCID: string,
    svgBlob: any
  ) => void
) => {
  const exporter = new GLTFExporter();
  if (!scene) {
    return console.error("scene is missing");
  }
  if (customEgg.description === undefined) {
    return console.error("please describe your egg");
  }
  if (customEgg.name === undefined) {
    return console.error("please name your egg");
  }
  const { description, name } = customEgg;
  alert(description + name);
  exporter.parse(
    scene,
    async (sceneGLTF) => {
      const eggVG = document.getElementById(EGGVG);
      const data: any = createBlobs(sceneGLTF, eggVG, description, name);
      alert(data);
      alert(PIN_URL);
      const r = await pinBlobs(data);
      alert(r);
      if (r.success) {
        var arr: any = [];
        for (var p in Object.getOwnPropertyNames(r.byteArray)) {
          arr[p] = r.byteArray[p];
        }
        const svgUrl = URL.createObjectURL(data.get("svg"));
        const patternHash = ethers.utils.hexlify(arr);
        const response = await saveYaytso(
          userId,
          name,
          description,
          patternHash,
          r.metaCID,
          r.svgCID,
          r.gltfCID
        );
        if (response) {
          successCallBack(r.metaCID, r.svgCID, r.gltfCID, svgUrl);
        } else {
          console.error("save failed");
        }
      }
    },
    { onlyVisible: true }
  );
};
