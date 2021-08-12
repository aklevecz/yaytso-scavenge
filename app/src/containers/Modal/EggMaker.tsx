import { useUpdateEgg } from "../../contexts/UserContext";
import SlideModal from "./SlideModal";

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
  const { updateEgg } = useUpdateEgg();

  return <SlideModal propMap={eggMakerMap} updateCallback={updateEgg} />;
}
