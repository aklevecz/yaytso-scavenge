export enum ModalTypes {
  Info = "info",
  CartonContent = "cartonContent",
}

export type Position = {
  lat: number | undefined;
  lng: number | undefined;
};

export type MarkerType = "cartons" | "users";

export type Marker = {
  type: string;
  marker: google.maps.Marker;
};

export type Carton = {
  id: number;
  lat: string;
  lng: string;
  locked: boolean;
  yaytsoId: number | undefined;
};

export type YaytsoMeta = {
  name: string;
  description: string;
  image: string;
};
