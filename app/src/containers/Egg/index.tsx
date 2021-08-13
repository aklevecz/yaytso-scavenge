import { Fragment, useEffect, useRef } from "react";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import Button from "../../components/buttons/Button";
import { useOpenModal } from "../../contexts/ModalContext";
import { useUpdatePattern } from "../../contexts/PatternContext";
import { useThreeScene } from "../../contexts/ThreeContext";
import { ModalTypes } from "../../contexts/types";
import { useCustomEgg } from "../../contexts/UserContext";
import "../../styles/egg.css";
import { pinBlobs } from "./services";
import { createBlobs } from "./utils";

export default function Egg() {
  const sceneContainer = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { initScene, scene } = useThreeScene();
  const { uploadPattern, pattern, clearPattern } = useUpdatePattern();
  const customEgg = useCustomEgg();
  const openModal = useOpenModal();

  const reset = () => {
    clearPattern();
    inputRef.current!.value = "";
  };

  const exportYaytso = async () => {
    const exporter = new GLTFExporter();
    if (!scene) {
      return console.error("scene is missing");
    }
    exporter.parse(
      scene,
      async (sceneGLTF) => {
        const data = createBlobs(sceneGLTF, "desc", "name");
        const r = await pinBlobs(data);
        console.log(r);
      },
      { onlyVisible: true }
    );
  };

  useEffect(() => {
    if (!sceneContainer.current) {
      return;
    }
    const cleanup = initScene(sceneContainer.current);

    return () => cleanup();
  }, [initScene]);

  return (
    <div className="egg__container">
      <div className="canvas__container" ref={sceneContainer} />
      <div style={{ position: "absolute", left: 100, top: 100 }}>
        <div>{customEgg.name}</div>
        <div>{customEgg.description}</div>
        <div>{customEgg.recipient}</div>
      </div>
      <div>
        <label className="upload-label">
          <input ref={inputRef} onChange={uploadPattern} type="file" />
          Upload
        </label>
        {/* {pattern && ( */}
        <Fragment>
          <Button
            name="Customize Egg"
            size="lg"
            onClick={() => openModal(ModalTypes.EggMaker)}
          />
          <Button name="Clear" onClick={reset} />
          <Button name="Export" onClick={exportYaytso} />
          <Button name="Login" onClick={() => openModal(ModalTypes.Login)} />
        </Fragment>
        {/* )} */}
      </div>
    </div>
  );
}
