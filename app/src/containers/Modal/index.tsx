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

const modalMap = {
  info: <Info />,
  cartonContent: <CartonContent />,
  eggMaker: <EggMaker />,
  login: <Login />,
};

export default function Modal() {
  const open = useModalOpen();
  const [display, setDisplay] = useState(false);
  const toggleModal = useModalToggle();
  const modalType = useModalType();

  useEffect(() => {
    if (open) {
      setDisplay(true);
    }
  }, [open]);

  return createPortal(
    <div className={`modal__container ${display ? "open" : ""}`}>
      <CSSTransition
        in={open}
        timeout={200}
        classNames="fade-in"
        onExited={() => setDisplay(false)}
      >
        <div className="modal__wrapper">
          <button onClick={toggleModal} className="modal__close">
            <CloseIcon />
          </button>
          <div className="modal__content">
            {modalType && modalMap[modalType]}
          </div>
        </div>
      </CSSTransition>
      <div onClick={toggleModal} className="modal__bg"></div>
    </div>,
    document.getElementById("modal-root") as Element
  );
}
