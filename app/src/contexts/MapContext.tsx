import {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useRef,
} from "react";
import { Loader } from "@googlemaps/js-api-loader";
import silverMap from "../silverMap.json";

type Action =
  | { type: "createMarker" }
  | { type: "initMap"; map: google.maps.Map };

type Dispatch = (action: Action) => void;

type State = {
  markers: Array<google.maps.Marker>;
  map: google.maps.Map | undefined;
  mapContainer: HTMLDivElement | undefined;
};

const initialState = {
  markers: [],
  map: undefined,
  mapContainer: undefined,
};

const MapContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "createMarker":
      return { ...state, markers: [] };
    case "initMap":
      return { ...state, map: action.map };
    default:
      return state;
  }
};

const loader = new Loader({
  apiKey: process.env.REACT_APP_GMAP_KEY as string,
  version: "weekly",
});

const DEFAULT_LAT = 34.04362997897908;
const DEFAULT_LNG = -118.2376335045432;

const MapProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const value = { state, dispatch };
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export { MapContext, MapProvider };

export const useMap = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const context = useContext(MapContext);

  if (context === undefined) {
    throw new Error("must be within its provider: User");
  }

  const { dispatch } = context;
  const initMap = useCallback(() => {
    loader.load().then(() => {
      if (!mapContainer.current) {
        return console.error("map container missing");
      }
      const map = new google.maps.Map(mapContainer.current, {
        zoom: 15,
        styles: silverMap,
        center: {
          lat: DEFAULT_LAT,
          lng: DEFAULT_LNG,
        },
      });
      dispatch({ type: "initMap", map });
    });
  }, [dispatch]);

  return { mapContainer, initMap };
};
