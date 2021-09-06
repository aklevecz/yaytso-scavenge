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
import { WalletState, WalletTypes } from "./types";
import { WalletContext } from "./WalletContext";

const YAYTSO_HARDHAT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const YAYTSO_MAIN_ADDRESS = "0x155b65c62e2bf8214d1e3f60854df761b9aa92b3";
const CARTON_MAIN_ADDRESS = "0x7c05cf1a1608eE23652014FB12Cb614F3325CFB5";

const YAYTSO_RINKEBY_ADDRESS = "0xC9D478fbb72c7F4Cb16eAb4b8bEF2F09776A45C2";
const CARTON_RINKEBY_ADDRESS = "0x8b401BEe910bd2B810715Ca459434A884C266324";

const NETWORK =
  process.env.NODE_ENV === "development" ? "hardhat" : "homestead";

const YAYTSO_ADDRESS =
  NETWORK === "hardhat" ? YAYTSO_RINKEBY_ADDRESS : YAYTSO_MAIN_ADDRESS;

const contractMap: { [key: string]: { interface: any; address: string } } = {
  yaytso: { interface: YaytsoInterface, address: YAYTSO_ADDRESS },
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

const provider =
  process.env.NODE_ENV === "development"
    ? new ethers.providers.JsonRpcProvider()
    : ethers.providers.getDefaultProvider(NETWORK, {
        infura: process.env.REACT_APP_INFURA_KEY,
        alchemy: process.env.REACT_APP_ALCHEMY_KEY,
        etherscan: process.env.REACT_APP_ETHERSCAN_KEY,
      });

const initialState = {
  yaytsoContract: undefined,
  cartonContract: undefined,
  provider,
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
  const wallet = useContext(WalletContext);

  if (context === undefined) {
    throw new Error("Carton Context error in Cartons hook");
  }

  const { dispatch, state } = context;

  const { yaytsoContract } = state;

  const getYaytsoURI = async (yaytsoId: number) => {
    if (!yaytsoContract) {
      return null;
    }
    const meta = await yaytsoContract.tokenURI(yaytsoId);
    return meta;
  };

  const rawLayYaytsoTx = async (
    yaytsoContract: ethers.Contract,
    wallet: WalletState,
    patternHash: string,
    metaCID: string
  ) => {
    const raw = await yaytsoContract.populateTransaction.layYaytso(
      wallet.address,
      patternHash,
      metaCID
    );
    return raw;
  };

  const layYaytso = async (
    wallet: WalletState,
    recipient: string,
    pattern: string,
    uri: string
  ) => {
    if (!yaytsoContract) {
      return console.error("contract is missing");
    }
    const id = 1;
    const address = wallet.address;
    const patternHash = wallet.yaytsoMeta[id].patternHash;
    const metaCID = wallet.yaytsoCIDS[id].metaCID;

    if (wallet.wallet.type === WalletTypes.MetaMask) {
      if (!wallet.signer) {
        return console.error("signer missing");
      }
      const contractSigner = yaytsoContract.connect(wallet.signer);
      const tx = await contractSigner
        .layYaytso(address, patternHash, metaCID)
        .catch((e: any) => ({ error: true, message: e }));
      if (tx.error) {
        alert("no dupes");
        return console.error(tx.message);
      }
      const receipt = await tx.wait();
      for (const event of receipt.events) {
        console.log(event);
      }
    }

    if (wallet.wallet.type === WalletTypes.WalletConnect) {
      if (!wallet.wallet.walletConnect) {
        console.log("no connect");
        return null;
      }
      const rawTx = await rawLayYaytsoTx(
        yaytsoContract,
        wallet,
        patternHash,
        metaCID
      );
      console.log(rawTx);
      const tx = {
        from: wallet.address,
        to: rawTx.to,
        data: rawTx.data,
        // gasPrice: ethers.utils.hexlify(80000000000), // Optional
      };
      console.log("send it");
      wallet.wallet.walletConnect.connector
        .sendTransaction(tx)
        .then((txHash) => {
          console.log(txHash);
        })
        .catch(console.log);
    }
  };

  return { contract: state.yaytsoContract, getYaytsoURI, layYaytso };
};
