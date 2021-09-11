import { Fragment, useEffect, useState } from "react";
import Button from "../../components/Button";
import { useOpenModal } from "../../contexts/ModalContext";
import { ModalTypes, WalletState } from "../../contexts/types";
import { useYaytsoSVGs } from "../../contexts/WalletContext";

type Props = {
  wallet: WalletState;
};

export default function Eggs({ wallet }: Props) {
  const [ready, setReady] = useState(false);
  const { svgs } = useYaytsoSVGs();
  const openModal = useOpenModal();

  useEffect(() => {
    if (svgs.length > 0) {
      setTimeout(() => setReady(true), 2000);
    }
  }, [svgs]);
  return (
    <Fragment>
      {!ready && (
        <div className="loading-dot__container">
          <div className="dot-typing-inverse"></div>
        </div>
      )}
      <div className="wallet__egg-container">
        {ready &&
          svgs.map((svg, i) => {
            const onClick = () => openModal(ModalTypes.Mint, { id: i });
            return (
              <div key={`yaytso${i}`} className="wallet__egg-wrapper">
                <div dangerouslySetInnerHTML={{ __html: svg }} />
                {wallet.eth && (
                  <Button
                    name="Mint"
                    onClick={onClick}
                    width="50%"
                    size="flex"
                  />
                )}
              </div>
            );
          })}
      </div>
    </Fragment>
  );
}
