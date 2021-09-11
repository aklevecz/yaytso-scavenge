import { Fragment, useEffect, useRef, useState } from "react";
import EggMask from "../../components/Mask/Egg";
import { useOpenModal } from "../../contexts/ModalContext";
import { useUpdatePattern } from "../../contexts/PatternContext";
import { useThreeScene } from "../../contexts/ThreeContext";
import { useCustomEgg, useUser } from "../../contexts/UserContext";
import { EGGVG, EGG_MASK, ViewStates } from "./constants";
import { exportYaytso } from "./services";
import Button from "../../components/Button";
import { ModalTypes } from "../../contexts/types";
import FloatingButtonContainer from "../../components/Button/FloatingButtonContainer";
import { isMobile } from "../../utils";
import LoadingButton from "../../components/Button/LoadingButton";

import "../../styles/egg.css";
import Buttons from "./Buttons";

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

  const reset = () => {
    clearPattern();
    clearEgg();
  };

  const onExport = () => {
    setViewState(ViewStates.Creating);
    exportYaytso(scene, customEgg, user.uid, () =>
      setViewState(ViewStates.Success)
    );
  };

  return (
    <div className="egg__container">
      <div className="canvas__container" ref={sceneContainer} />
      <div
        className="egg__details"
        style={{ position: "absolute", left: 50, top: 100 }}
      >
        <div>{customEgg.name}</div>
        <div>{customEgg.description}</div>
        <div>{customEgg.recipient}</div>
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
