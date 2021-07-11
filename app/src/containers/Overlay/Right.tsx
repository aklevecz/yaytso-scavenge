import { useEffect } from "react";
import { useMap, useUserLocation } from "../../contexts/MapContext";
import Triangulate from "../../components/icons/Triangulate";

export default function Right() {
  const { getUserLocation, createUserMarker, userLocation, recenter } =
    useUserLocation();
  const { loading } = useMap();

  // NOTE: This is not where this should be dumbass
  useEffect(() => {
    if (loading) {
      return;
    }
    const interval = setInterval(getUserLocation, 2000);
    return () => clearInterval(interval);
  }, [loading, getUserLocation]);
  return (
    <div className="overlay__right">
      <div style={{ marginRight: 10 }}>
        <button className="btn--icon" onClick={recenter}>
          <Triangulate />
        </button>
      </div>
    </div>
  );
}
