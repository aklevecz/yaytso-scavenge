import { useEffect, useRef } from "react";
import { useThreeScene } from "../../contexts/ThreeContext";

export default function Egg() {
  const sceneContainer = useRef<HTMLDivElement | null>(null);
  const { initScene } = useThreeScene();
  useEffect(() => {
    if (!sceneContainer.current) {
      return;
    }
    initScene(sceneContainer.current);
  }, [initScene]);
  return (
    <div
      style={{ width: window.innerWidth, height: window.innerHeight }}
      ref={sceneContainer}
    >
      Egg
    </div>
  );
}
