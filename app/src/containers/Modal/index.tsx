import { createPortal } from "react-dom";
import { CSSTransition } from "react-transition-group";
import CloseIcon from "../../components/icons/CloseIcon";
import {
  useModalOpen,
  useModalToggle,
  useModalType,
} from "../../contexts/ModalContext";
import Info from "./Info";
import CartonContent from "./CartonContent";
import { useEffect, useState } from "react";
import EggMaker from "./EggMaker";
import Login from "./Login";
import Mint from "./Mint";

const modalMap = {
  info: { component: <Info />, maxState: 0 },
  cartonContent: { component: <CartonContent />, maxState: 0 },
  eggMaker: { component: <EggMaker />, maxState: 2 },
  login: { component: <Login />, maxState: 1 },
  mint: {
    component: <Mint />,
    maxState: 1,
  },
};

export default function Modal() {
  const open = useModalOpen();
  const [display, setDisplay] = useState(false);
  const { toggleModal, onModalBack, setMaxModalState } = useModalToggle();
  const modalType = useModalType();
  const modal = modalType && modalMap[modalType];

  useEffect(() => {
    if (open) {
      setDisplay(true);
    }
  }, [open]);

  useEffect(() => {
    if (!modal) {
      return;
    }
    setMaxModalState(modal.maxState);
  }, [modalType, setMaxModalState, modal]);

  if (!modal) {
    return <div></div>;
  }

  return createPortal(
    <div className={`modal__container ${display ? "open" : ""}`}>
      <CSSTransition
        in={open}
        timeout={200}
        classNames="fade-in"
        onExited={() => setDisplay(false)}
      >
        <div className="modal__wrapper">
          <button onClick={onModalBack} className="modal__back">
            back
          </button>
          <button onClick={toggleModal} className="modal__close">
            <CloseIcon />
          </button>
          <div className="modal__content">{modal.component}</div>
        </div>
      </CSSTransition>
      <div onClick={toggleModal} className="modal__bg"></div>
    </div>,
    document.getElementById("modal-root") as Element
  );
}
