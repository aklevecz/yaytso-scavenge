import Button from "../../components/Button";
import {
  useYaytsoSVGs,
  useMetaMask,
  useWallet,
  useWalletConnect,
} from "../../contexts/WalletContext";
import { useOpenModal } from "../../contexts/ModalContext";
import { useYaytsoContract } from "../../contexts/ContractContext";
import MintButton from "./MintButton";

export default function Wallet() {
  const { svgs } = useYaytsoSVGs();
  const wallet = useWallet();
  const { layYaytso } = useYaytsoContract();
  const { metamaskConnect, isConnected } = useMetaMask();
  const { startProvider } = useWalletConnect();
  const openModal = useOpenModal();
  return (
    <div className="wallet__root">
      <div className="wallet__container">
        <div className="wallet__address">{wallet.address}</div>
        {!isConnected && (
          <div>
            <div>
              <Button
                name="Connect Metamask"
                size="lg"
                onClick={metamaskConnect}
              />
            </div>
            <div>
              <Button name="Connect WC" size="lg" onClick={startProvider} />
            </div>
          </div>
        )}
        {/* <div>
          <button>create</button>
        </div> */}
        <div style={{ fontWeight: "bold", letterSpacing: 5 }}>yaytsos</div>
        {svgs.length === 0 && <div>loading...</div>}
        <div className="wallet__egg-container">
          {svgs.map((svg, i) => {
            const patternHash = wallet.yaytsoMeta[i].patternHash;
            const metaCID = wallet.yaytsoCIDS[i].metaCID;
            return (
              <div key={`yaytso${i}`} className="wallet__egg-wrapper">
                <div dangerouslySetInnerHTML={{ __html: svg }} />
                {wallet.eth && (
                  <MintButton
                    eth={wallet.eth}
                    patternHash={patternHash}
                    metaCID={metaCID}
                    openModal={openModal}
                    layYaytso={layYaytso}
                    id={i}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
