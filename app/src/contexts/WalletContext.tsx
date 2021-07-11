import { ethers } from "ethers";
import { createContext, useContext, useEffect, useReducer } from "react";

type Action = { type: "createWallet"; wallet: ethers.Wallet };

type Dispatch = (action: Action) => void;

type State = {
  wallet: ethers.Wallet | undefined;
};

const initialState = {
  wallet: undefined,
};

const WalletContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "createWallet":
      return { ...state, wallet: action.wallet };
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

  useEffect(() => {
    const wallet = localStorage.getItem("wallet");
    if (wallet) {
      const web3Wallet = new ethers.Wallet(wallet);
      dispatch({ type: "createWallet", wallet: web3Wallet });
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
