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
  const { modalState } = useModalToggle();
  const open = useModalOpen();
  const { layYaytso, txState, reset, checkYaytsoDupe } = useYaytsoContract();
  const { data } = useModalData();
  const [step, setStep] = useState(Step.Confirmation);

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
      reset();
    }
  }, [open]);

  const { id } = data;

  useEffect(() => {
    console.log(id);
    checkYaytsoDupe(id);
  }, [id]);

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
      </div>
    </div>
  );
}
