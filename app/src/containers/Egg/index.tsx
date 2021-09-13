import { useEffect, useRef, useState } from "react";
import EggMask from "../../components/Mask/Egg";
import { useOpenModal } from "../../contexts/ModalContext";
import { useUpdatePattern } from "../../contexts/PatternContext";
import { useThreeScene } from "../../contexts/ThreeContext";
import { useCustomEgg, useUser } from "../../contexts/UserContext";
import { EGGVG, EGG_MASK, ViewStates } from "./constants";
import { exportYaytso } from "./services";
import Buttons from "./Buttons";

import "../../styles/egg.css";
import { ModalTypes } from "../../contexts/types";

export default function Egg() {
  const [viewState, setViewState] = useState<ViewStates>(ViewStates.Blank);
  const sceneContainer = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const { initScene, scene } = useThreeScene();
  const { uploadPattern, pattern, clearPattern, updating } = useUpdatePattern();
  const { customEgg, clearEgg } = useCustomEgg();
  const openModal = useOpenModal();

  const user = useUser();

  useEffect(() => {
    if (!sceneContainer.current) {
      return;
    }
    const cleanup = initScene(sceneContainer.current);

    return () => cleanup();
  }, [initScene]);

  useEffect(() => {
    if (pattern && customEgg.name && customEgg.description) {
      return setViewState(ViewStates.Customized);
    }
    if (pattern) {
      return setViewState(ViewStates.Pattern);
    }
    return setViewState(ViewStates.Blank);
  }, [pattern, customEgg]);

  // MAYBE ONLY IF WAS CREATED?
  useEffect(() => {
    return () => clearEgg()
  }, [])

  const reset = () => {
    clearPattern();
    clearEgg();
  };

  const { name, description } = customEgg;

  const onExport = () => {
    setViewState(ViewStates.Creating);
    exportYaytso(scene, customEgg, user.uid, (metaCID, svgCID, gltfCID, svgUrl) => {
      setViewState(ViewStates.Success)
      openModal(ModalTypes.ExportReceipt, { metaCID, svgCID, gltfCID, svgUrl, name, description })
    }
    );
  };

  return (
    <div className="egg__container">
      <div className="canvas__container" ref={sceneContainer} />
      <div
        className="egg__details"
        style={{ position: "absolute", left: 50, top: 100 }}
      >
        <div>{name}</div>
        <div>{description}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <Buttons
          user={user}
          openModal={openModal}
          viewState={viewState}
          inputRef={inputRef}
          reset={reset}
          onExport={onExport}
          uploadPattern={uploadPattern}
          updating={updating}
        />
      </div>
      <EggMask visible={false} svgId={EGGVG} imgId={EGG_MASK} />
    </div>
  );
}
