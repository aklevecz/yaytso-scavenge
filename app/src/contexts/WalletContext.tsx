import { ethers } from "ethers";
import { createContext, useContext, useEffect, useReducer } from "react";
import { IPFS_URL } from "../constants";
import { db, YAYTSOS } from "../firebase";
import {
  WalletConnectState,
  WalletState,
  WalletTypes,
  YaytsoCID,
  YaytsoMeta,
} from "./types";
import { useUser } from "./UserContext";
import { Web3WindowApi } from "./Web3WindowApi";

import WalletConnect from "@walletconnect/client";
import QRCodeModal from "@walletconnect/qrcode-modal";

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
  | {
      type: "SET_WALLETCONNECT";
      wallet: WalletConnectState;
    }
  | { type: "DISCONNECT" }
  // | { type: "createWallet"; wallet: ethers.Wallet }
  | { type: "SET_CIDS"; yaytsoCIDS: YaytsoCID[] }
  | { type: "SET_META"; yaytsoMeta: YaytsoMeta[] }
  | { type: "SET_SVGs"; yaytsoSVGs: string[] };

type Dispatch = (action: Action) => void;

type State = WalletState;

const wallet = {
  type: WalletTypes.Null,
  metaMask: {
    provider: undefined,
    signer: undefined,
    address: "",
    chainId: undefined,
  },
  walletConnect: undefined,
};
const initialState = {
  wallet,
  connected: false,
  provider: undefined,
  signer: undefined,
  address: "",
  chainId: undefined,
  yaytsoMeta: [],
  yaytsoCIDS: [],
  yaytsoSVGs: [],
};

const WalletContext = createContext<
  | {
      state: State;
      dispatch: Dispatch;
      initWallet({
        provider,
        signer,
        address,
        chainId,
      }: {
        provider: ethers.providers.Web3Provider | ethers.providers.BaseProvider;
        signer: ethers.Signer;
        address: string;
        chainId: number;
      }): void;
      disconnect(): void;
    }
  | undefined
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
    // case "createWallet":
    //   return { ...state, wallet: action.wallet };
    case "SET_WALLETCONNECT":
      return {
        ...state,
        wallet: {
          ...state.wallet,
          type: WalletTypes.WalletConnect,
          walletConnect: action.wallet,
        },
      };
    case "SET_CIDS":
      return { ...state, yaytsoCIDS: action.yaytsoCIDS };
    case "SET_META":
      return { ...state, yaytsoMeta: action.yaytsoMeta };
    case "SET_SVGs":
      return { ...state, yaytsoSVGs: action.yaytsoSVGs };
    case "DISCONNECT":
      return initialState;
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

  const initWallet = ({
    signer,
    address,
    chainId,
    provider,
  }: {
    signer: ethers.Signer;
    address: string;
    chainId: number;
    provider: ethers.providers.Web3Provider | ethers.providers.BaseProvider;
  }) => dispatch({ type: "INIT_WALLET", signer, address, chainId, provider });

  const disconnect = () => dispatch({ type: "DISCONNECT" });

  useEffect(() => {
    const wallet = localStorage.getItem("wallet");
    if (wallet) {
      const web3Wallet = new ethers.Wallet(wallet);
      // dispatch({ type: "createWallet", wallet: web3Wallet });
    }
  }, []);

  useEffect(() => {
    if (user) {
      db.collection(YAYTSOS)
        .where("uid", "==", user.uid)
        .get()
        .then((snapshot) => {
          let yaytsoCIDS: YaytsoCID[] = [];
          let yaytsoMeta: YaytsoMeta[] = [];
          snapshot.forEach((data) => {
            const { metaCID, svgCID, gltfCID, name, description, patternHash } =
              data.data();
            yaytsoCIDS.push({ metaCID, svgCID, gltfCID });
            yaytsoMeta.push({ name, description, patternHash, image: "" });
          });
          dispatch({ type: "SET_CIDS", yaytsoCIDS });
          dispatch({ type: "SET_META", yaytsoMeta });
        });
    }
  }, [user]);
  const value = { state, dispatch, initWallet, disconnect };
  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};

export { WalletContext, WalletProvider };

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("Wallet Context error in Wallet hook");
  }

  const { dispatch, state } = context;
  return state;
};

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

export const useMetaMask = () => {
  const context = useContext(WalletContext);

  if (context === undefined) {
    throw new Error("Wallet Context error in MetaMask hook");
  }
  const { dispatch, state, initWallet, disconnect } = context;

  const web3WindowConnect = async () => {
    const web3 = new Web3WindowApi();
    const { address, chainId } = await web3.requestAccount().catch(console.log);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    initWallet({ signer, address, chainId, provider });
    return web3;
  };

  const metamaskConnect = () => {
    if (window.ethereum) {
      web3WindowConnect()
        .then((web3) => {
          if (web3.isAvailable) {
            web3.onNetworkChange(initWallet);
            web3.onAccountChange(initWallet, disconnect);
          }
        })
        .catch(console.log);
    }
  };

  return { metamaskConnect, isConnected: state.connected };
};

export const useWalletConnect = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("Wallet Context error in WalletConnect hook");
  }

  const { dispatch, state } = context;

  useEffect(() => {
    const connector = new WalletConnect({
      bridge: "https://bridge.walletconnect.org", // Required
      qrcodeModal: QRCodeModal,
    });

    if (!connector.connected) {
      connector.createSession();
    } else {
      const { accounts, chainId } = connector;
      dispatch({
        type: "SET_WALLETCONNECT",
        wallet: { address: accounts[0], chainId, connector },
      });
    }

    connector.on("connect", (error, payload) => {
      if (error) {
        throw error;
      }
      const { accounts, chainId } = payload.params[0];
      dispatch({
        type: "SET_WALLETCONNECT",
        wallet: { connector, address: accounts[0], chainId },
      });
    });

    connector.on("session_update", (error, payload) => {
      if (error) {
        throw error;
      }

      const { accounts, chainId } = payload.params[0];
      console.log("update");
      dispatch({
        type: "SET_WALLETCONNECT",
        wallet: { connector, address: accounts[0], chainId },
      });
    });

    connector.on("disconnect", (error, payload) => {
      if (error) {
        throw error;
      }
      console.log("disconnect");
    });
  }, []);
  return state;
};
