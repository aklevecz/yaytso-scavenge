import { useState } from "react";
import Button from "../../components/Button";
import LoadingButton from "../../components/Button/LoadingButton";
import { TxStates, useYaytsoContract } from "../../contexts/ContractContext";
import { useModalData, useModalToggle } from "../../contexts/ModalContext";
import { BiAnim } from "./Transitions";

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
      <div>you ready for this?</div>
    </div>
  );
};

enum Step {
  Recipient,
  Confirmation,
}

export default function Mint() {
  const { modalState, onModalNext } = useModalToggle();
  const { layYaytso, txState } = useYaytsoContract();
  const { data } = useModalData();
  const [step, setStep] = useState(Step.Confirmation);
  const nextStep = () => onModalNext();

  const txStates = [
    "",
    "Waiting for signature",
    "Minting...",
    "Completed!",
    "Failed!",
  ];

  const { id } = data;
  const lay = () => layYaytso(id);
  return (
    <div>
      <div className="modal__title">Mint</div>
      <BiAnim state={modalState} changeView={() => setStep(modalState)}>
        <div className="modal__block">
          {step === Step.Recipient && <Recipient />}
          {step === Step.Confirmation && <Confirmation />}
          {txStates[txState ? txState : 0]}
        </div>
      </BiAnim>
      <div className="modal__button-container">
        {txState === TxStates.Idle && <Button name="Ok" onClick={lay} />}
        {/* {txState && txState > TxStates.Idle && txState < TxStates.Completed ? (
          <LoadingButton color="white" />
        ) : (
          ""
        )} */}
      </div>
    </div>
  );
}
