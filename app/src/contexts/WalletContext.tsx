import { ethers } from "ethers";
import { createContext, useContext, useEffect, useReducer } from "react";
import { db, YAYTSOS } from "../firebase";
import { YaytsoMeta } from "./types";
import { useUser } from "./UserContext";

type Action =
  | { type: "createWallet"; wallet: ethers.Wallet }
  | { type: "SET_COLLECTION"; yaytsos: YaytsoMeta[] };

type Dispatch = (action: Action) => void;

type State = {
  wallet: ethers.Wallet | undefined;
  yaytsoCollection: YaytsoMeta[];
};

const initialState = {
  wallet: undefined,
  yaytsoCollection: [],
};

const WalletContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "createWallet":
      return { ...state, wallet: action.wallet };
    case "SET_COLLECTION":
      return { ...state, yaytsoCollection: action.yaytsos };
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
          snapshot.forEach((d) => console.log(d.data()));
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
