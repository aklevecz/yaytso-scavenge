import { ethers } from "ethers";
import { createContext, useContext, useEffect, useReducer } from "react";
import { IPFS_URL } from "../constants";
import { db, YAYTSOS } from "../firebase";
import { YaytsoCID, YaytsoMeta } from "./types";
import { useUser } from "./UserContext";

type Action =
  | { type: "createWallet"; wallet: ethers.Wallet }
  | { type: "SET_CIDS"; yaytsoCIDS: YaytsoCID[] };

type Dispatch = (action: Action) => void;

type State = {
  wallet: ethers.Wallet | undefined;
  yaytsoCollection: YaytsoMeta[];
  yaytsoCIDS: YaytsoCID[];
};

const initialState = {
  wallet: undefined,
  yaytsoCollection: [],
  yaytsoCIDS: [],
};

const WalletContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "createWallet":
      return { ...state, wallet: action.wallet };
    case "SET_CIDS":
      return { ...state, yaytsoCIDS: action.yaytsoCIDS };
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

          const svgPromises = yaytsoCIDS.map((yaytsoCID) => {
            fetch(`${IPFS_URL}/${yaytsoCID.svgCID}`).then(console.log);
          });
        });
    }
  }, [user]);

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
