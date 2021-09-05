import Button from "../../components/Button";
import { useYaytsoSVGs, useMetaMask } from "../../contexts/WalletContext";
import { useOpenModal } from "../../contexts/ModalContext";
import { ModalTypes } from "../../contexts/types";

const ADDRESS = "0x64Cd8c5207A69916232Bda691aC52Bc3326D80AE";

export default function Wallet() {
  const { svgs } = useYaytsoSVGs();
  const { metamaskConnect, isConnected } = useMetaMask();
  const openModal = useOpenModal();
  return (
    <div className="wallet__root">
      <div className="wallet__container">
        <div className="wallet__address">Create a Wallet</div>
        {!isConnected && (
          <div>
            <Button
              name="Connect Metamask"
              size="lg"
              onClick={metamaskConnect}
            />
          </div>
        )}
        <div>
          <button>create</button>
        </div>
        <div>yaytsos</div>
        {svgs.length === 0 && <div>loading...</div>}
        <div className="wallet__egg-container">
          {svgs.map((svg, i) => {
            return (
              <div key={`yaytso${i}`} className="wallet__egg-wrapper">
                <div dangerouslySetInnerHTML={{ __html: svg }} />
                <Button
                  name="Mint"
                  onClick={() => openModal(ModalTypes.Mint)}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
