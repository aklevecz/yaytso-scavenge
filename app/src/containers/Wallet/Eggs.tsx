import { Fragment, useEffect, useState } from "react";
import Button from "../../components/Button";
import { useOpenModal } from "../../contexts/ModalContext";
import { ModalTypes, WalletState } from "../../contexts/types";
import { useYaytsoSVGs } from "../../contexts/WalletContext";

type Props = {
  wallet: WalletState;
};

const NoEggs = () => <div>no eggs</div>;

export default function Eggs({ wallet }: Props) {
  const [ready, setReady] = useState(false);
  const { svgs, fetching, svgToNFT } = useYaytsoSVGs();
  const openModal = useOpenModal();

  useEffect(() => {
    if (!fetching) {
      setTimeout(() => setReady(true), 2000);
    }
  }, [fetching]);

  if (fetching || !ready) {
    return (
      <div className="loading-dot__container">
        <div className="dot-typing-inverse"></div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="wallet__title">YAYTSOS</div>
      <div className="wallet__egg-container">
        {svgs.map((svg, i) => {
          const onClick = () => openModal(ModalTypes.Mint, { id: i });
          return (
            <div key={`yaytso${i}`} className="wallet__egg-wrapper">
              <div dangerouslySetInnerHTML={{ __html: svg }} />
              {wallet.eth && !svgToNFT[i] ? (
                <Button name="Mint" onClick={onClick} width="50%" size="flex" />
              ) : (
                <div
                  className="wallet__nft-tag"
                >
                  NFT
                </div>
              )}
            </div>
          );
        })}
        {svgs.length === 0 && <NoEggs />}
      </div>
    </Fragment>
  );
}
