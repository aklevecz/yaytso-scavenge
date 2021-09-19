import Button from "../../components/Button";
import { useModalData, useModalToggle } from "../../contexts/ModalContext";

export default function EggInfo() {
  const { toggleModal } = useModalToggle();

  const { data } = useModalData()
  const { name, description, metaCID } = data.metadata;
  return (
    <div>
      <div className="modal__title">Info</div>
      <div className=""><div>
        {name}</div><div>{description}</div><div>{metaCID}</div></div>
      <div className="modal__button-container">
        <Button name="Ok" onClick={toggleModal} />
      </div>
    </div>
  );
}
