import Button from "../../components/buttons/Button";
import { useModalToggle } from "../../contexts/ModalContext";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useEffect, useState } from "react";
import firebase from "firebase";

export default function Login() {
  const toggleModal = useModalToggle();
  const [value, setValue] = useState("+14159671642");
  useEffect(() => {
    (window as any).recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "submit-phone",
      {
        size: "invisible",
        callback: (response: any) => {
          console.log(response);
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          //     onSignInSubmit();
        },
      }
    );
  }, []);

  const submit = () => {
    const appVerifier = (window as any).recaptchaVerifier;
    firebase
      .auth()
      .signInWithPhoneNumber(value, appVerifier)
      .then((confirmResult: any) => {
        confirmResult.confirm("123456").then((result: any) => {
          console.log(result);
        });
      });
  };
  return (
    <div>
      <div className="modal__title">Login</div>
      <div className="modal__block">
        <div>
          <PhoneInput
            className="phone-input"
            placeholder="Enter phone number"
            country="US"
            value={value}
            onChange={setValue}
          />
        </div>
      </div>
      <div className="modal__button-container">
        <Button id="submit-phone" name="Ok" onClick={submit} />
      </div>
    </div>
  );
}
