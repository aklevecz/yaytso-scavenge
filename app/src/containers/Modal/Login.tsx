import Button from "../../components/Button";
import { useModalToggle } from "../../contexts/ModalContext";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import firebase from "firebase";
import { BiAnim } from "./Transitions";
import { useLogin } from "../../contexts/UserContext";
import LoadingButton from "../../components/Button/LoadingButton";
import ChevronLeft from "../../components/icons/ChevronLeft";

type PhoneProps = {
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  submitPhone: () => void;
  loading: boolean;
};

const PhoneNumber = ({ phone, setPhone, submitPhone, loading }: PhoneProps) => {
  return (
    <div>
      <div className="modal__input-container">
        <PhoneInput
          className="phone-input"
          placeholder="Enter phone number"
          country="US"
          defaultCountry="US"
          value={phone}
          onChange={setPhone}
          autoFocus={true}
        />
      </div>
      <div className="modal__button-container">
        {!loading ? (
          <Button name="Submit" onClick={submitPhone} />
        ) : (
          <LoadingButton color="white" />
        )}
      </div>
    </div>
  );
};

type ConfirmProps = {
  onCodeChange: (e: React.FormEvent<HTMLInputElement>) => void;
  confirmCode: () => void;
  loading: boolean;
};

const Confirm = ({ onCodeChange, confirmCode, loading }: ConfirmProps) => {
  return (
    <div>
      <div>Confirmation Code</div>
      <div className="modal__input-container">
        <input onChange={onCodeChange} autoFocus={true}></input>
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {!loading ? (
          <Button name="Confirm" onClick={confirmCode} />
        ) : (
          <LoadingButton color="white" />
        )}
      </div>
    </div>
  );
};

enum Step {
  Phone,
  Confirm,
}

const initialStep = Step.Phone;
// const initialPhoneNumber = "+14159671642";
const initialPhoneNumber = "";

// This should be refactored to use the modal state shit
export default function Login() {
  const [loading, setLoading] = useState(false);
  const { toggleModal } = useModalToggle();
  const { login } = useLogin();
  const [phone, setPhone] = useState(initialPhoneNumber);
  const [confirmationResult, setConfirmationResult] =
    useState<firebase.auth.ConfirmationResult>();
  const [code, setCode] = useState("");
  const [state, setState] = useState(initialStep);
  const [step, setStep] = useState(initialStep);
  const [error, setError] = useState("");
  useEffect(() => {
    if (step === Step.Phone) {
      if ((window as any).recaptchaVerifier) return;
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
    }
  }, [step]);

  useEffect(() => {
    setTimeout(() => {
      const phoneInput = document.querySelector(
        ".phone-input"
      ) as HTMLInputElement;
      phoneInput && phoneInput.focus();
      console.log("select");
    }, 2000);
  }, []);

  const submitPhone = () => {
    setLoading(true);
    const appVerifier = (window as any).recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(phone, appVerifier)
      .then((confirmResult) => {
        setLoading(false);
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
    setLoading(true);
    confirmationResult.confirm(code).then((result) => {
      if (!result.user) {
        return console.error("user is missing");
      }
      setLoading(false);
      login(result.user);
      toggleModal();
    });
  };

  return (
    <div>
      <div className="modal__title">
        {step > Step.Phone && (
          <button onClick={() => setState(state - 1)} className="modal__back">
            <ChevronLeft />
          </button>
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
                loading={loading}
              />
            )}
            {step === Step.Confirm && (
              <Confirm
                onCodeChange={onCodeChange}
                confirmCode={confirmCode}
                loading={loading}
              />
            )}
          </React.Fragment>
          {error && error}
        </div>
      </BiAnim>
      <span id="submit-phone" />
    </div>
  );
}
