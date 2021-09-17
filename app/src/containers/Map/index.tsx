import { useEffect } from "react";
import { useMap } from "../../contexts/MapContext";
import Overlay from "../Overlay";

export default function Map() {
  const { mapContainer, initMap, loading } = useMap();

  useEffect(() => {
    initMap();
  }, [initMap]);
  return (
    <>
      <div style={{ width: "100%", flex: "1 0 100%", overflow: "hidden" }} ref={mapContainer}></div>
      {loading && <div>loading...</div>}
      <Overlay />
    </>
  );
}
