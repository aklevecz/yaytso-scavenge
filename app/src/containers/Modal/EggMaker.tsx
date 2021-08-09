import React, { useEffect, useRef, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Button from "../../components/buttons/Button";
import { useModalToggle } from "../../contexts/ModalContext";
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

export default function EggMaker() {
  const toggleModal = useModalToggle();
  const { updateEgg } = useUpdateEgg();
  const [state, setState] = useState(0);
  const prevState = useRef(state);

  const props = eggMakerMap[state];

  const onChange = (e: React.FormEvent<HTMLInputElement>) =>
    (props.value = e.currentTarget.value);

  const update = () => {
    updateEgg({ [props.param]: props.value });
    setState(state + 1);
  };

  useEffect(() => {
    prevState.current = state;
  }, [state]);

  const transitionClass = `slide${prevState.current > state ? "-back" : ""}`;
  return (
    <div>
      <SwitchTransition>
        <CSSTransition
          key={state}
          addEndListener={(node, done) =>
            node.addEventListener("transitionend", done, false)
          }
          classNames={transitionClass}
        >
          <div>
            <div className="modal__title">{props.cta}</div>
            <div className="modal__block">
              <input type="text" onChange={onChange}></input>
            </div>
          </div>
        </CSSTransition>
      </SwitchTransition>
      <div className="modal__button-container">
        <Button name="Back" onClick={() => setState(state - 1)} />
        <Button name="Ok" onClick={update} />
      </div>
    </div>
  );
}
