import { useYaytsoSVGs } from "../../contexts/WalletContext";

const ADDRESS = "0x64Cd8c5207A69916232Bda691aC52Bc3326D80AE";
export default function Wallet() {
  const { svgs } = useYaytsoSVGs();
  // console.log(svgs);
  return (
    <div className="wallet__root">
      <div className="wallet__container">
        <div className="wallet__address">Create a Wallet</div>
        <div>
          <button>create</button>
        </div>
        <div>yaytsos</div>
        {svgs.map((svg, i) => {
          return (
            <div
              className="modal__svg-container"
              key={`egg${i}`}
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          );
        })}
      </div>
    </div>
  );
}
