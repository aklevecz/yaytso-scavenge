import { Signer } from "ethers";
import Button from "../../components/Button";
import { Eth, ModalTypes } from "../../contexts/types";

type Props = {
  eth: Eth;
  patternHash: string;
  metaCID: string;
  openModal: (modalType: ModalTypes, data?: any) => void;
  layYaytso:
    | (() => void)
    | ((
        address: string,
        signer: Signer,
        patternHash: string,
        metaCID: string,
        index: number
      ) => Promise<void>);
  id: number;
};

export default function MintButton({
  eth,
  patternHash,
  metaCID,
  openModal,
  layYaytso,
  id,
}: Props) {
  const onClick = () => {
    openModal(ModalTypes.Mint, {
      layYaytso: () => {
        const { address, signer } = eth;
        layYaytso(address, signer, patternHash, metaCID, id);
      },
    });
  };

  return <Button name="Mint" onClick={onClick} size="flex" />;
}
