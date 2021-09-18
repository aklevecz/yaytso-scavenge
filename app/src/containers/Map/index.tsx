import { useEffect, useState } from "react";
import { NAV_CLASS_NAME } from "../../constants";
import { useMap } from "../../contexts/MapContext";
import Overlay from "../Overlay";

export default function Map() {
  const [containerHeight, setContainerHeight] = useState(0)
  const { mapContainer, initMap, loading } = useMap();

  useEffect(() => {
    initMap();

    const windowHeight = window.innerHeight;
    const navEl = document.querySelector(`.${NAV_CLASS_NAME}`) as HTMLDivElement;

    if (navEl) {
      const navHeight = navEl.clientHeight;
      const fullHeight = windowHeight - navHeight
      setContainerHeight(fullHeight);
    }
  }, [initMap]);

  return (
    <>
      <div style={{ width: "100%", flex: containerHeight ? "unset" : "1 0 100%", overflow: "hidden", height: containerHeight }} ref={mapContainer}></div>
      {loading && <div>loading...</div>}
      <Overlay />
    </>
  );
}
