import { Fragment } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import TagText from "../../components/Text/Tag";
import { useOpenModal } from "../../contexts/ModalContext";
import { ModalTypes, WalletState } from "../../contexts/types";
import { useYaytsoSVGs } from "../../contexts/WalletContext";
import { ipfsLink } from "../../utils";
import EggImg from "./EggImg";

type Props = {
  wallet: WalletState;
};

const NoEggs = () => <div style={{ fontSize: "1.5rem", width: "70%" }}><div>you haven't created any eggs yet!</div><p>go to the <Link style={{ color: "red" }} to="/egg">egg</Link> view to begin!</p></div>;

export default function Eggs({ wallet }: Props) {
  const { svgs, fetching, svgToNFT, yaytsoMeta, metaFetched } = useYaytsoSVGs();
  const openModal = useOpenModal();


  // Ew
  if (!metaFetched
    //  || (svgs.length > 0 && svgToNFT.length === 0)
  ) {
    return (
      <div style={{ marginTop: 100 }} className="loading-dot__container">
        <div className="dot-typing-inverse"></div>
      </div>
    );
  }
  console.log(yaytsoMeta, metaFetched)
  return (
    <Fragment>
      <div className="wallet__title" style={{ display: "flex", justifyContent: "center" }}><TagText fontSize="2rem" padding={"10px 20px"}>YOUR YAYTSOS</TagText></div>
      <div className="wallet__egg-container">
        {yaytsoMeta.map((meta, i) => {
          const onClick = () => openModal(ModalTypes.Mint, { id: i });
          const hasWallet = wallet.eth && wallet.address
          const isNFT = meta.nft;
          return (
            <div key={`yaytso${i}`} className="wallet__egg-wrapper">
              <div style={{ fontSize: "2rem", fontWeight: "bold", display: "flex", justifyContent: "center" }}><TagText>{meta.name}</TagText></div>
              {/* <div dangerouslySetInnerHTML={{ __html: svg }} /> */}
              <EggImg cid={meta.svgCID} />
              {hasWallet && !isNFT && (
                <Button name="Mint" onClick={onClick} width="30%" size="flex" />)}
              {isNFT && <div style={{ background: "red", fontWeight: "bold", fontSize: "2rem" }}>NFT</div>}
            </div>
          );
        })}
        {yaytsoMeta.length === 0 && <NoEggs />}
      </div>
    </Fragment>
  );
}
