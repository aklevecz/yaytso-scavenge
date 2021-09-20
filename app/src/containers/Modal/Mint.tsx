import { Fragment, useEffect, useState } from "react";
import Button from "../../components/Button";
import LoadingButton from "../../components/Button/LoadingButton";
import { TxStates, useYaytsoContract } from "../../contexts/ContractContext";
import {
  useModalData,
  useModalOpen,
  useModalToggle,
} from "../../contexts/ModalContext";
import { BiAnim } from "./Transitions";

import smiler from "../../assets/smiler.svg"
import Pen from "../../components/icons/Pen"
import Gear from "../../components/icons/Gear"
import Fire from "../../components/icons/Fire"

import "../../styles/mint.css"
import { ipfsLink } from "../../utils";
import { useUpdateYaytsos } from "../../contexts/WalletContext";

const Recipient = () => {
  return (
    <div>
      <div>Who would you like to send it to?</div>
      <input type="text" />
    </div>
  );
};

const Confirmation = () => {
  return (
    <div>
      <div style={{ textAlign: "center" }}>Mint an NFT?</div>
      <div style={{ padding: "25px 0 10px", display: "flex", justifyContent: 'center' }}><Fire /></div>
    </div>
  );
};

const txStates = [
  "",
  "Waiting for signature",
  "Minting...",
  "Completed!",
  "Failed!",
];

const txIcons = [
  "",
  <Pen />,
  <Gear />
]

const txAnimations = [
  "",
  "pulse-infinite",
  "spin-infinite"
]

const Minting = ({ state }: { state: TxStates }) => {

  const status = txStates[state]
  let icon = txIcons[state]
  const className = txAnimations[state]
  return (
    <div>
      <div style={{ textAlign: "center" }}>{status}</div>
      <div className={""} style={{ margin: "25px 0 10px", display: 'flex', justifyContent: 'center' }}>{icon}</div>
    </div>
  )
}

const Bold = ({ children }: { children: JSX.Element | string }) => <span style={{ fontWeight: "bold" }}>{children}</span>

const RINKEBY_ETHERSCAN = "https://rinkeby.etherscan.io/tx"
const Receipt = (receipt: any) => {
  const { metaCID, svgCID, transactionHash, blockNumber, tokenId } = receipt.receipt;
  return (
    <div className="mint__receipt">
      <div className="mint__receipt__id">{tokenId}</div>
      <div><Bold>Metadata</Bold> <a className="mint__receipt__meta-cid" href={ipfsLink(metaCID)}>ipfs://{metaCID}</a></div>
      <div><Bold>Tx</Bold> <a className="mint__receipt__tx-hash" href={`${RINKEBY_ETHERSCAN}/${transactionHash}`}>{transactionHash}</a></div>
      <div><Bold>Block#</Bold><div className="mint__receipt__block-number">{blockNumber}</div></div>
      <img className="mint__receipt__img" src={ipfsLink(svgCID)}></img>
    </div >
  )
}

const Error = ({ message }: { message: string }) => (<div>
  {message}
</div>)

enum Step {
  Recipient,
  Confirmation,
  Minting,
  Completed,
  Error
}

// TODO: Consolidate Step and TxStates because they overlap a lot
export default function Mint() {
  const { modalState, toggleModal } = useModalToggle();
  const open = useModalOpen();
  const { layYaytso, reset, txState, checkYaytsoDupe, receipt } = useYaytsoContract();
  const { updateYaytsos } = useUpdateYaytsos();
  const { data } = useModalData();
  const [step, setStep] = useState(Step.Confirmation);

  const [error, setError] = useState("")

  // REFACTOR
  useEffect(() => {
    if (!open) {
      setStep(Step.Confirmation)
      reset();
    }
  }, [open]);

  const { metadata } = data;

  useEffect(() => {
    checkYaytsoDupe(metadata.patternHash);
  }, [metadata]);

  useEffect(() => {
    if (txState === TxStates.Completed) {
      setStep(Step.Completed)
    }
  }, [txState])

  const lay = async () => {
    setStep(Step.Minting);
    console.log(metadata)
    const response = await layYaytso(metadata);
    console.log(response)
    if (response.error) {
      setStep(Step.Error)
      setError(response.message)
    } else {
      updateYaytsos();
    }
  };

  return (
    <div>
      {/* <div className="modal__title">Mint</div> */}
      <BiAnim state={modalState} changeView={() => setStep(modalState)}>
        <div className="modal__block">
          {step === Step.Recipient && <Recipient />}
          {step === Step.Confirmation && <Confirmation />}
          {step === Step.Minting && txState && < Minting state={txState} />}
          {step === Step.Completed && <Receipt receipt={receipt} />}
          {step === Step.Error && <Error message={error} />}
        </div>
      </BiAnim>
      <div className="modal__button-container">
        {step !== Step.Error && (
          <Fragment>
            {txState === TxStates.Idle && <Button name="Yes" onClick={lay} />}
            {txState !== TxStates.Idle && txState !== TxStates.Completed && txState !== TxStates.Failed && <LoadingButton color="white" />}
            {txState === TxStates.Completed && <Button name="Done" onClick={toggleModal} />}
          </Fragment>)}
        {step === Step.Error && <Button name="Ok" onClick={toggleModal} />}
      </div>
    </div>
  );
}
