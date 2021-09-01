import Button from "../../components/Button";
import { useModalToggle } from "../../contexts/ModalContext";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import firebase from "firebase";
import { BiAnim } from "./Transitions";
import { useLogin } from "../../contexts/UserContext";

type PhoneProps = {
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  submitPhone: () => void;
};

const PhoneNumber = ({ phone, setPhone, submitPhone }: PhoneProps) => {
  return (
    <div>
      <div>
        <PhoneInput
          className="phone-input"
          placeholder="Enter phone number"
          country="US"
          value={phone}
          onChange={setPhone}
        />
      </div>
      <div className="modal__button-container">
        <Button id="submit-phone" name="Ok" onClick={submitPhone} />
      </div>
    </div>
  );
};

type ConfirmProps = {
  onCodeChange: (e: React.FormEvent<HTMLInputElement>) => void;
  confirmCode: () => void;
};

const Confirm = ({ onCodeChange, confirmCode }: ConfirmProps) => {
  return (
    <div>
      <div>Confirmation Code</div>
      <div>
        <input onChange={onCodeChange}></input>
      </div>
      <Button name="Confirm" onClick={confirmCode} />
    </div>
  );
};

enum Step {
  Phone,
  Confirm,
}

export default function Login() {
  const { toggleModal } = useModalToggle();
  const { login } = useLogin();
  const [phone, setPhone] = useState("+14159671642");
  const [confirmationResult, setConfirmationResult] =
    useState<firebase.auth.ConfirmationResult>();
  const [code, setCode] = useState("");
  const [state, setState] = useState(Step.Phone);
  const [step, setStep] = useState(Step.Phone);
  const [error, setError] = useState("");
  useEffect(() => {
    //     if (step !== Step.Phone) {
    //       return;
    //     }
    (window as any).recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "submit-phone",
      {
        size: "invisible",
        callback: (response: any) => {
          //   console.log(response);
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          //     onSignInSubmit();
        },
      }
    );
  }, []);

  const submitPhone = () => {
    const appVerifier = (window as any).recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phone, appVerifier)
      .then((confirmResult) => {
        setConfirmationResult(confirmResult);
        setState(Step.Confirm);
        // confirmResult.confirm("123456").then((result: any) => {
        //   console.log(result);
        // });
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  const onCodeChange = (e: React.FormEvent<HTMLInputElement>) =>
    setCode(e.currentTarget.value);

  const confirmCode = () => {
    if (!confirmationResult) {
      return;
    }
    if (!code) {
      return;
    }
    confirmationResult.confirm(code).then((result) => {
      if (!result.user) {
        return console.error("user is missing");
      }
      login(result.user);
      toggleModal();
    });
  };

  return (
    <div>
      <div className="modal__title">
        {step > Step.Phone && (
          <Button name="<" onClick={() => setState(state - 1)} />
        )}
        Login
      </div>
      <BiAnim state={state} changeView={() => setStep(state)}>
        <div className="modal__block">
          <React.Fragment>
            {step === Step.Phone && (
              <PhoneNumber
                phone={phone}
                setPhone={setPhone}
                submitPhone={submitPhone}
              />
            )}
            {step === Step.Confirm && (
              <Confirm onCodeChange={onCodeChange} confirmCode={confirmCode} />
            )}
          </React.Fragment>
          {error && error}
        </div>
      </BiAnim>
    </div>
  );
}
