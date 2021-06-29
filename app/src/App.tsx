import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useRef, useState } from "react";
import "./App.css";

const loader = new Loader({
  apiKey: "AIzaSyDb2g6i-IS8JNI6ihW6NakNJ1CTdBaIxXg",
  version: "weekly",
});

const DEFAULT_LAT = 34.04362997897908;
const DEFAULT_LNG = -118.2376335045432;

function App() {
  const [map, setMap] = useState<google.maps.Map>();
  const mapContainer = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let map: google.maps.Map;
    loader.load().then(() => {
      if (!mapContainer.current) {
        return console.error("map container missing");
      }
      map = new google.maps.Map(mapContainer.current, {
        zoom: 15,
        center: {
          lat: DEFAULT_LAT,
          lng: DEFAULT_LNG,
        },
      });
      setMap(map);
    });
  }, []);
  return (
    <div className="App">
      <div style={{ width: "100%", height: "100%" }} ref={mapContainer}></div>
    </div>
  );
}

export default App;
