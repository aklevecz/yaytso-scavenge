import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Button from "../../components/Button";
import EggMask from "../../components/Mask/Egg";
import TagText from "../../components/Text/Tag";
import { useModalToggle, useModalData } from "../../contexts/ModalContext";
import { createEggMask } from "../../contexts/utils";
import { EGGVG } from "../EggCreation/constants";


export default function ExportReceipt() {
  const [egg, setEgg] = useState<any>(null);
  const { toggleModal, open } = useModalToggle();
  const {
    data: { name, description, canvas },
  } = useModalData();
  const history = useHistory();
  useEffect(() => {
    if (open) {
      // const egg: any = document.getElementById(EGGVG)?.cloneNode(true);
      // if (egg) {
      //   alert(egg)
      //   egg.style.display = "";
      //   const clipPath = egg.getElementById("clip-path");
      //   if (clipPath) {
      //     clipPath.id = "clip-path-export";
      //     const g = egg.querySelectorAll("#SVG > g")[0]!;
      //     g.setAttribute("clip-path", "url(#clip-path-export)");
      //     const html = egg.outerHTML;
      //     const container = document.querySelector(".egg-container");
      //     container!.innerHTML = html;
      //   } else {
      //     alert(clipPath)
      //   }

      // } else {
      //   alert(egg)
      // }

      const eggMask = document.getElementById("eggMask2") as HTMLImageElement;
      createEggMask(eggMask, canvas, 200, 200);
    }
  }, [open]);

  const done = () => {
    toggleModal();
    history.push("/wallet");
  };
  return (
    <div>
      {/* <div className="modal__title">Your Beautiful Egg</div> */}
      <div className="modal__block columns" style={{ position: "relative", textAlign: "center", border: "1px solid black", margin: 20 }}>
        <TagText>{name}</TagText>
        {/* <div className="egg-container" style={{ width: "100%" }} /> */}
        <EggMask visible={true} svgId={EGGVG + "2"} imgId={"eggMask2"} />

        <TagText>{description}</TagText>
      </div>
      <div className="modal__button-container">
        <Button name="Ok" onClick={done} />
      </div>
    </div>
  );
}
