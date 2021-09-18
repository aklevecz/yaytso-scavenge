import { useEffect, useRef, useState } from "react";
import { useOpenModal } from "../../contexts/ModalContext";
import { useDraw, useUpdatePattern } from "../../contexts/PatternContext";
import { useThreeScene } from "../../contexts/ThreeContext";
import { useCustomEgg, useUser } from "../../contexts/UserContext";

import "../../styles/egg.css";
import LayoutFullHeight from "../../components/Layout/FullHeight";

export default function Egg() {
  const sceneContainer = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { initScene, scene } = useThreeScene();
  const user = useUser();

  useEffect(() => {
    if (!sceneContainer.current) {
      return;
    }

    const cleanup = initScene(sceneContainer.current);

    return () => cleanup();
  }, [initScene, sceneContainer.current]);




  return (
    <LayoutFullHeight>
      <div className="egg__container">
        <div className="canvas__container" ref={sceneContainer} />
      </div></LayoutFullHeight>
  );
}
