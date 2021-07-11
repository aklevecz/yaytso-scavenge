import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { ethers } from "ethers";
import YaytsoInterface from "../ethereum/contracts/Yaytso.sol/Yaytso.json";
import CartonInterface from "../ethereum/contracts/Carton.sol/Carton.json";

const YAYTSO_MAIN_ADDRESS = "0x155b65c62e2bf8214d1e3f60854df761b9aa92b3";
const CARTON_MAIN_ADDRESS = "0x7c05cf1a1608eE23652014FB12Cb614F3325CFB5";

const CARTON_RINKEBY_ADDRESS = "0x8b401BEe910bd2B810715Ca459434A884C266324";

const NETWORK = "homestead";

const contractMap: { [key: string]: { interface: any; address: string } } = {
  yaytso: { interface: YaytsoInterface, address: YAYTSO_MAIN_ADDRESS },
  carton: { interface: CartonInterface, address: CARTON_RINKEBY_ADDRESS },
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
  provider: ethers.providers.getDefaultProvider(NETWORK, {
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

  const initContract = useCallback(
    (contract: string) => {
      const address = contractMap[contract].address;
      const abi = contractMap[contract].interface.abi;
      return new ethers.Contract(address, abi, state.provider);
    },
    [state.provider]
  );

  useEffect(() => {
    const yaytsoContract = initContract("yaytso");
    const cartonContract = initContract("carton");

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
  }, [initContract, state.provider]);

  const value = { state, dispatch };
  return (
    <ContractContext.Provider value={value}>
      {children}
    </ContractContext.Provider>
  );
};

export { ContractContext, ContractProvider };

export const useCartonContract = () => {
  const context = useContext(ContractContext);

  if (context === undefined) {
    throw new Error("Carton Context error in Cartons hook");
  }

  const { dispatch, state } = context;

  return state.cartonContract;
};

export const useYaytsoContract = () => {
  const context = useContext(ContractContext);

  if (context === undefined) {
    throw new Error("Carton Context error in Cartons hook");
  }

  const { dispatch, state } = context;

  const getYaytsoURI = async (yaytsoId: number) => {
    if (!state.yaytsoContract) {
      return null;
    }
    const meta = await state.yaytsoContract.tokenURI(yaytsoId);
    return meta;
  };

  return { contract: state.yaytsoContract, getYaytsoURI };
};
