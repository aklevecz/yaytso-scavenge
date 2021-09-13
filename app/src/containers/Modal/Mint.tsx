import { useEffect, useState } from "react";
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

import "../../styles/mint.css"
import { IPFS_URL } from "../../constants";

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
      <div>Make this egg into an NFT?</div>
    </div>
  );
};

const Minting = ({ status }: { status: string }) => {
  console.log(status, "status")
  return (
    <div style={{ padding: "20px 0" }}>
      {status}
    </div>
  )
}
const RINKEBY_ETHERSCAN = "https://rinkeby.etherscan.io/tx"
const Receipt = (receipt: any) => {
  const { metaCID, svg, transactionHash, blockNumber, tokenId } = receipt.receipt;
  return (
    <div className="mint__receipt">
      <div className="mint__receipt__id">{tokenId}</div>
      <div>Metadata: <a className="mint__receipt__meta-cid" href={`${IPFS_URL}/${metaCID}`}>{metaCID}</a></div>
      <div>Tx: <a className="mint__receipt__tx-hash" href={`${RINKEBY_ETHERSCAN}/${transactionHash}`}>{transactionHash}</a></div>
      <div>Block#:<div className="mint__receipt__block-number">{blockNumber}</div></div>
      <div className="mint__receipt__img" dangerouslySetInnerHTML={{ __html: svg }}></div>
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
  const { data } = useModalData();
  const [step, setStep] = useState(Step.Confirmation);

  const [error, setError] = useState("")

  const txStates = [
    "",
    "Waiting for signature",
    "Minting...",
    "Completed!",
    "Failed!",
  ];

  // REFACTOR
  useEffect(() => {
    if (!open) {
      setStep(Step.Confirmation)
      reset();
    }
  }, [open]);

  const { id } = data;

  useEffect(() => {
    checkYaytsoDupe(id);
  }, [id]);

  useEffect(() => {
    if (txState === TxStates.Completed) {
      setStep(Step.Completed)
    }
  }, [txState])

  const lay = async () => {
    setStep(Step.Minting);
    const response = await layYaytso(id);
    if (response.error) {
      setStep(Step.Error)
      setError(response.message)
    }
  };

  return (
    <div>
      {/* <div className="modal__title">Mint</div> */}
      <BiAnim state={modalState} changeView={() => setStep(modalState)}>
        <div className="modal__block">
          {step === Step.Recipient && <Recipient />}
          {step === Step.Confirmation && <Confirmation />}
          {step === Step.Minting && txState && < Minting status={txStates[txState]} />}
          {step === Step.Completed && <Receipt receipt={receipt} />}
          {step === Step.Error && <Error message={error} />}
        </div>
      </BiAnim>
      <div className="modal__button-container">
        {txState === TxStates.Idle && <Button name="Yes" onClick={lay} />}
        {txState !== TxStates.Idle && txState !== TxStates.Completed && txState !== TxStates.Failed && <LoadingButton color="white" />}
        {txState === TxStates.Completed && <Button name="Done" onClick={toggleModal} />}
        {step === Step.Error && <Button name="Ok" onClick={toggleModal} />}

      </div>
    </div>
  );
}
