import { useEffect } from "react";
import { useMap } from "../contexts/MapContext";

export default function Map() {
  const { mapContainer, initMap } = useMap();

  useEffect(() => {
    initMap();
  }, [initMap]);

  return (
    <div style={{ width: "100%", height: "100%" }} ref={mapContainer}></div>
  );
}
