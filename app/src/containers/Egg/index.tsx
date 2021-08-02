import { useEffect, useRef } from "react";
import Button from "../../components/buttons/Button";
import { useOpenModal } from "../../contexts/ModalContext";
import { useUploadPattern } from "../../contexts/PatternContext";
import { useThreeScene } from "../../contexts/ThreeContext";
import { ModalTypes } from "../../contexts/types";
import "../../styles/egg.css";

export default function Egg() {
  const sceneContainer = useRef<HTMLDivElement | null>(null);
  const { initScene } = useThreeScene();
  const { uploadPattern } = useUploadPattern();
  const openModal = useOpenModal();
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
      <div>
        <label className="upload-label">
          <input onChange={uploadPattern} type="file" />
          Upload
        </label>
        <Button
          name="Customize Egg"
          onClick={() => openModal(ModalTypes.EggMaker)}
        />
      </div>
    </div>
  );
}
