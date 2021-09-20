import { useEffect, useRef, Fragment } from "react";
import { useThreeScene, useFetchedYaytso } from "../../contexts/ThreeContext";
import { useOpenModal } from "../../contexts/ModalContext";
import LayoutFullHeight from "../../components/Layout/FullHeight";
import { useParams, useHistory } from "react-router-dom";
import Button from "../../components/Button";

import "../../styles/egg-view.css";
import { ModalTypes } from "../../contexts/types";
import DotTyping from "../../components/Loading/DotTyping";
import { deleteYaytso } from "../../contexts/services";

export default function Egg() {
  const { eggId } = useParams<{ eggId: string }>()
  const history = useHistory()
  const sceneContainer = useRef<HTMLDivElement | null>(null);
  const { initScene } = useThreeScene();
  const metadata = useFetchedYaytso(eggId)
  const openModal = useOpenModal();

  useEffect(() => {
    if (!sceneContainer.current) {
      return;
    }
    if (!metadata) {
      return;
    }

    const cleanup = initScene(sceneContainer.current, true);

    return () => cleanup();
  }, [initScene, metadata]);
  const onClick = () => openModal(ModalTypes.Mint, { metadata });
  const openEggInfo = () => openModal(ModalTypes.EggInfo, { metadata })

  if (!metadata) {
    return <DotTyping />
  }

  const deleteEgg = () => deleteYaytso(metadata.metaCID).then(success => {
    if (success) {
      history.push("/wallet")
    } else {
      alert("Oops something went wrong!")
    }
  })
  return (
    <LayoutFullHeight>
      <div className="egg-view__container">
        <div className="egg-view__name">{metadata && metadata.name}</div>
        <button className="info-button" onClick={openEggInfo}>i</button>
        <div className="egg-view__canvas__container" ref={sceneContainer} style={{ alignItems: "unset", paddingTop: 27 }} />
        <div className="egg-view__description">{metadata && metadata.description}</div>
        <div className="egg-view__mint-button-container">
          {metadata && !metadata.nft && (<Fragment><Button name="Mint into NFT" className="flex3" onClick={onClick} /><Button name="Delete" className="flex3 danger" onClick={deleteEgg} /></Fragment>)}
          {metadata && metadata.nft && <div style={{ color: "lime", fontWeight: "bold", fontSize: "2.5rem", width: "80%", textAlign: "center", padding: 12 }}>NFT</div>}
        </div>
      </div></LayoutFullHeight>
  );
}
