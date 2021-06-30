import { createContext, useCallback, useEffect, useReducer } from "react";
import { ethers } from "ethers";
import YaytsoInterface from "../ethereum/contracts/Yaytso.sol/Yaytso.json";
import CartonInterface from "../ethereum/contracts/Carton.sol/Carton.json";

const YAYTSO_MAIN_ADDRESS = "0x155b65c62e2bf8214d1e3f60854df761b9aa92b3";
const CARTON_MAIN_ADDRESS = "0x7c05cf1a1608eE23652014FB12Cb614F3325CFB5";

const contractMap = {
  yaytsoContract: YaytsoInterface,
  cartonContract: CartonInterface,
};

type Action = {
  type: "initContract";
  contractName: "yaytsoContract" | "cartonContract";
  contract: ethers.Contract;
};

type Dispatch = (action: Action) => void;

type State = {
  yaytsoContract: ethers.Contract | undefined;
  cartonContract: ethers.Contract | undefined;
  provider: ethers.providers.BaseProvider;
};

const initialState = {
  yaytsoContract: undefined,
  cartonContract: undefined,
  provider: ethers.providers.getDefaultProvider("homestead", {
    infura: process.env.REACT_APP_INFURA_KEY,
    alchemy: process.env.REACT_APP_ALCHEMY_KEY,
    etherscan: process.env.REACT_APP_ETHERSCAN_KEY,
  }),
};

const ContractContext = createContext<
  { state: State; dispatch: Dispatch } | undefined
>(undefined);

const reducer = (state: State, action: Action) => {
  switch (action.type) {
    case "initContract":
      return { ...state, [action.contractName]: action.contract };
    default:
      return state;
  }
};

const ContractProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const initContracts = useCallback(() => {
    const yaytsoContract = new ethers.Contract(
      YAYTSO_MAIN_ADDRESS,
      YaytsoInterface.abi,
      state.provider
    );
    const cartonContract = new ethers.Contract(
      CARTON_MAIN_ADDRESS,
      CartonInterface.abi,
      state.provider
    );

    return { cartonContract, yaytsoContract };
  }, [state.provider]);

  useEffect(() => {
    const { yaytsoContract, cartonContract } = initContracts();
    dispatch({
      type: "initContract",
      contractName: "yaytsoContract",
      contract: yaytsoContract,
    });

    dispatch({
      type: "initContract",
      contractName: "cartonContract",
      contract: cartonContract,
    });
  }, [initContracts]);
  const value = { state, dispatch };
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export { ContractContext, ContractProvider };
