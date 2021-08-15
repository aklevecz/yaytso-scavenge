import React, { useState } from "react";
import Button from "../../components/buttons/Button";
import { useModalToggle } from "../../contexts/ModalContext";
import { BiAnim } from "./Transitions";

// Make transition state part of the modal context so the upper level components
// have access to the call manipulating the child useEffect

// Or this could be a generate component that takes an update function and viewDataMap
export default function SlideModal({ propMap, updateCallback }: any) {
  // const [state, setState] = useState(0);
  const { modalState, onModalNext, maxState, toggleModal } = useModalToggle();
  const state = modalState;
  const [view, setView] = useState(0);

  const props = propMap[view];

  const onChange = (e: React.FormEvent<HTMLInputElement>) =>
    (props.value = e.currentTarget.value);

  const update = () => {
    updateCallback({ [props.param]: props.value });
    // setState(state + 1);
    if (modalState < maxState) {
      onModalNext();
    } else {
      toggleModal();
    }
  };

  // const back = () => {
  //   // setState(state - 1);
  // };
  console.log(state);
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
        {/* <Button name="Back" onClick={back} /> */}
        <Button name="Ok" onClick={update} />
      </div>
    </div>
  );
}
