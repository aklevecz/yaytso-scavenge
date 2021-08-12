import React, { useEffect, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Button from "../../components/buttons/Button";
import { useUpdateEgg } from "../../contexts/UserContext";

type ModalProps = {
  param: string;
  cta: string;
  value: string;
};

const eggMakerMap: { [key: number]: ModalProps } = {
  0: { param: "name", cta: "Name your egg", value: "" },
  1: { param: "description", cta: "Describe your egg", value: "" },
  2: { param: "recipient", cta: "Who are you sending it to?", value: "" },
};

type AnimProps = {
  children: JSX.Element | JSX.Element[];
  state: number;
  callback: () => void;
  view: number;
};

const BiAnim = ({ children, state, callback, view }: AnimProps) => {
  const [nonce, setNonce] = useState(0);
  const [transitionClass, setTransitionClass] = useState("slide");
  const [prevState, setPrevState] = useState(state);

  useEffect(() => {
    setTransitionClass(`slide${prevState > state ? "-back" : ""}`);
    setPrevState(state);
  }, [state]);

  useEffect(() => {
    if (view === state) return;
    setNonce(nonce + 1);
  }, [prevState]);

  return (
    <SwitchTransition>
      <CSSTransition
        key={nonce}
        addEndListener={(node, done) => {
          callback();
          node.addEventListener("transitionend", done, false);
        }}
        classNames={transitionClass}
      >
        {children}
      </CSSTransition>
    </SwitchTransition>
  );
};

export default function EggMaker() {
  const { updateEgg } = useUpdateEgg();
  const [state, setState] = useState(0);
  const [view, setView] = useState(0);

  const props = eggMakerMap[view ? view : 0];

  const onChange = (e: React.FormEvent<HTMLInputElement>) =>
    (props.value = e.currentTarget.value);

  const update = () => {
    updateEgg({ [props.param]: props.value });
    setState(state + 1);
  };

  const back = () => {
    setState(state - 1);
  };

  return (
    <div>
      <BiAnim state={state} view={view} callback={() => setView(state)}>
        <div>
          <div className="modal__title">{props.cta}</div>
          <div className="modal__block">
            <input type="text" onChange={onChange}></input>
          </div>
        </div>
      </BiAnim>
      <div className="modal__button-container">
        <Button name="Back" onClick={back} />
        <Button name="Ok" onClick={update} />
      </div>
    </div>
  );
}
