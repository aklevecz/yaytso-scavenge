import { useState } from "react";
import Button from "../../components/Button";
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
  const { data } = useModalData();
  const [step, setStep] = useState(Step.Recipient);
  const nextStep = () => onModalNext();

  const { layYaytso, wallet, contract } = data;
  return (
    <div>
      <div className="modal__title">Mint</div>
      <BiAnim state={modalState} changeView={() => setStep(modalState)}>
        <div className="modal__block">
          {step === Step.Recipient && <Recipient />}
          {step === Step.Confirmation && <Confirmation />}
        </div>
      </BiAnim>
      <div className="modal__button-container">
        <Button name="Ok" onClick={() => layYaytso(wallet, "", "", "")} />
      </div>
    </div>
  );
}
