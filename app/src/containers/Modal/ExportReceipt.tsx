import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../components/Button";
import TagText from "../../components/Text/Tag";
import { useModalToggle, useModalData } from "../../contexts/ModalContext";
import { EGGVG } from "../Egg/constants";


export default function ExportReceipt() {
  const [egg, setEgg] = useState<any>(null);
  const { toggleModal, open } = useModalToggle();
  const {
    data: { name, description },
  } = useModalData();
  const history = useHistory();
  useEffect(() => {
    if (open) {
      const egg: any = document.getElementById(EGGVG)?.cloneNode(true);
      egg.style.display = "";
      const clipPath = egg.getElementById("clip-path")!;
      clipPath.id = "clip-path-export";
      const g = egg.querySelectorAll("#SVG > g")[0]!;
      g.setAttribute("clip-path", "url(#clip-path-export)");
      const html = egg.outerHTML;
      const container = document.querySelector(".egg-container");
      container!.innerHTML = html;
    }
  }, [open]);

  const done = () => {
    toggleModal();
    history.push("/wallet");
  };
  return (
    <div>
      <div className="modal__title">Your Beautiful Egg</div>
      <div className="modal__block columns" style={{ position: "relative", textAlign: "center", border: "1px solid black", margin: 20 }}>
        <TagText>{name}</TagText>
        <div className="egg-container" style={{ width: "100%" }} />
        <TagText>{description}</TagText>
      </div>
      <div className="modal__button-container">
        <Button name="Ok" onClick={done} />
      </div>
    </div>
  );
}
