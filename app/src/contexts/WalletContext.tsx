import { ethers } from "ethers";
import { createContext, useContext, useEffect, useReducer } from "react";
import { IPFS_URL } from "../constants";
import { db, YAYTSOS } from "../firebase";
import { YaytsoCID, YaytsoMeta } from "./types";
import { useUser } from "./UserContext";
import { Web3WindowApi } from "./Web3WindowApi";

declare global {
  interface Window {
    ethereum: any;
  }
}

type Action =
  | {
      type: "INIT_WALLET";
      provider: ethers.providers.Web3Provider | ethers.providers.BaseProvider;
      signer: ethers.Signer;
      address: string;
      chainId: number;
    }
  | { type: "createWallet"; wallet: ethers.Wallet }
  | { type: "SET_CIDS"; yaytsoCIDS: YaytsoCID[] }
  | { type: "SET_SVGs"; yaytsoSVGs: string[] };

type Dispatch = (action: Action) => void;

type State = {
  wallet: ethers.Wallet | undefined;
  connected: boolean;
  provider:
    | ethers.providers.BaseProvider
    | ethers.providers.Web3Provider
    | undefined;
  signer: ethers.Signer | undefined;
  address: string;
  chainId: number | undefined;
  yaytsoCollection: YaytsoMeta[];
  yaytsoCIDS: YaytsoCID[];
  yaytsoSVGs: string[];
};

const initialState = {
  wallet: undefined,
  connected: false,
  provider: undefined,
  signer: undefined,
  address: "",
  chainId: undefined,
  yaytsoCollection: [],
  yaytsoCIDS: [],
  yaytsoSVGs: [],
};

const WalletContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "INIT_WALLET":
      return {
        ...state,
        address: action.address,
        signer: action.signer,
        provider: action.provider,
        chainId: action.chainId,
        connected: true,
      };
    case "createWallet":
      return { ...state, wallet: action.wallet };
    case "SET_CIDS":
      return { ...state, yaytsoCIDS: action.yaytsoCIDS };
    case "SET_SVGs":
      return { ...state, yaytsoSVGs: action.yaytsoSVGs };
    default:
      return state;
  }
};

const WalletProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const user = useUser();

  const initWallet = (
    signer: ethers.Signer,
    address: string,
    chainId: number,
    provider: ethers.providers.Web3Provider | ethers.providers.BaseProvider
  ) => dispatch({ type: "INIT_WALLET", signer, address, chainId, provider });

  useEffect(() => {
    const wallet = localStorage.getItem("wallet");
    if (wallet) {
      const web3Wallet = new ethers.Wallet(wallet);
      dispatch({ type: "createWallet", wallet: web3Wallet });
    }
  }, []);

  useEffect(() => {
    if (user) {
      db.collection(YAYTSOS)
        .where("uid", "==", user.uid)
        .get()
        .then((snapshot) => {
          let yaytsoCIDS: YaytsoCID[] = [];
          snapshot.forEach((data) => {
            const { metaCID, svgCID, gltfCID } = data.data();
            yaytsoCIDS.push({ metaCID, svgCID, gltfCID });
          });
          dispatch({ type: "SET_CIDS", yaytsoCIDS });
        });
    }
  }, [user]);

  const web3WindowConnect = async (web3: Web3WindowApi) => {
    const { signer, address, chainId, provider } = await web3.requestAccount();
    console.log(signer, address, chainId, provider);
    initWallet(signer, address, chainId, provider);
  };

  useEffect(() => {
    if (window.ethereum) {
      const web3 = new Web3WindowApi();
      if (web3.isAvailable) {
        web3WindowConnect(web3);
      }
    }
  }, []);
  const value = { state, dispatch };
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export { WalletContext, WalletProvider };

export const useCreateWallet = () => {
  const context = useContext(WalletContext);

  if (context === undefined) {
    throw new Error("Wallet Context error in CreateWallet hook");
  }

  const { dispatch, state } = context;
  return state;
};

export const useYaytsoSVGs = () => {
  const context = useContext(WalletContext);

  if (context === undefined) {
    throw new Error("Wallet Context error in YaytsoSVGs hook");
  }

  const { dispatch, state } = context;

  const { yaytsoCIDS } = state;

  useEffect(() => {
    const svgPromises = yaytsoCIDS.map((yaytsoCID) => {
      return fetch(`${IPFS_URL}/${yaytsoCID.svgCID}`).then((r) => r.text());
    });
    Promise.all(svgPromises).then((svgs) => {
      dispatch({ type: "SET_SVGs", yaytsoSVGs: svgs });
    });
  }, [yaytsoCIDS]);

  return { svgs: state.yaytsoSVGs };
};
