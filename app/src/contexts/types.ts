import { ethers } from "ethers";
import WalletConnect from "@walletconnect/client";

export enum ModalTypes {
  Info = "info",
  CartonContent = "cartonContent",
  EggMaker = "eggMaker",
  Login = "login",
  Mint = "mint",
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
  patternHash: string;
  image: string;
};

export type YaytsoCID = {
  metaCID: string;
  svgCID: string;
  gltfCID: string;
};

export type WalletConnectState = {
  connector: WalletConnect;
  address: string;
  chainId: number;
};

export enum WalletTypes {
  Null,
  WalletConnect,
  MetaMask,
}

export type Eth = {
  walletType: WalletTypes;
  chainId: number;
  provider: ethers.providers.Web3Provider | ethers.providers.BaseProvider;
  signer: ethers.Signer;
  address: string;
};

export type WalletState = {
  eth: Eth | undefined;
  connected: boolean;
  provider:
    | ethers.providers.BaseProvider
    | ethers.providers.Web3Provider
    | undefined;
  signer: ethers.Signer | undefined;
  address: string;
  chainId: number | undefined;
  yaytsoMeta: YaytsoMeta[];
  yaytsoCIDS: YaytsoCID[];
  yaytsoSVGs: string[];
};
