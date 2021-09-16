import { Fragment, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import TagText from "../../components/Text/Tag";
import { useOpenModal } from "../../contexts/ModalContext";
import { ModalTypes, WalletState } from "../../contexts/types";
import { useYaytsoSVGs } from "../../contexts/WalletContext";

type Props = {
  wallet: WalletState;
};

const NoEggs = () => <div style={{ fontSize: "1.5rem", width: "70%" }}><div>you haven't created any eggs yet!</div><p>go to the <Link style={{ color: "red" }} to="/egg">egg</Link> view to begin!</p></div>;

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
      <div className="wallet__title" style={{ display: "flex", justifyContent: "center" }}><TagText fontSize="2rem" padding={"10px 20px"}>YOUR YAYTSOS</TagText></div>
      <div className="wallet__egg-container">
        {svgs.map((svg, i) => {
          const onClick = () => openModal(ModalTypes.Mint, { id: i });
          const hasWallet = wallet.eth && wallet.address
          const isNFT = svgToNFT[i].nft;
          return (
            <div key={`yaytso${i}`} className="wallet__egg-wrapper">
              <div style={{ fontSize: "2rem", fontWeight: "bold", display: "flex", justifyContent: "center" }}><TagText>{svgToNFT[i].name}</TagText></div>
              <div dangerouslySetInnerHTML={{ __html: svg }} />
              {hasWallet && !isNFT && (
                <Button name="Mint" onClick={onClick} width="30%" size="flex" />)}
              {isNFT && <div style={{ background: "red", fontWeight: "bold", fontSize: "2rem" }}>NFT</div>}
            </div>
          );
        })}
        {svgs.length === 0 && <NoEggs />}
      </div>
    </Fragment>
  );
}
