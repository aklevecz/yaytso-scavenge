import React, { useEffect, useRef, useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import Button from "../../components/buttons/Button";

type AnimProps = {
  children: JSX.Element | JSX.Element[];
  state: number;
  changeView: () => void;
};

const BiAnim = ({ children, state, changeView }: AnimProps) => {
  const [nonce, setNonce] = useState(0);
  const [transitionClass, setTransitionClass] = useState("slide");
  const [prevState, setPrevState] = useState(state);
  const firstRender = useRef(true);

  useEffect(() => {
    setTransitionClass(`slide${prevState > state ? "-back" : ""}`);
    setPrevState(state);
  }, [state]);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setNonce(nonce + 1);
  }, [prevState]);

  return (
    <SwitchTransition>
      <CSSTransition
        key={nonce}
        addEndListener={(node, done) => {
          changeView();
          node.addEventListener("transitionend", done, false);
        }}
        classNames={transitionClass}
      >
        {children}
      </CSSTransition>
    </SwitchTransition>
  );
};

// Make transition state part of the modal context so the upper level components
// have access to the call manipulating the child useEffect

// Or this could be a generate component that takes an update function and viewDataMap
export default function SlideModal({ propMap, updateCallback }: any) {
  const [state, setState] = useState(0);
  const [view, setView] = useState(0);

  const props = propMap[view];

  const onChange = (e: React.FormEvent<HTMLInputElement>) =>
    (props.value = e.currentTarget.value);

  const update = () => {
    updateCallback({ [props.param]: props.value });
    setState(state + 1);
  };

  const back = () => {
    setState(state - 1);
  };

  return (
    <div>
      <BiAnim state={state} changeView={() => setView(state)}>
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
