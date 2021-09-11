import Button from "../../components/Button";
import {
  useMetaMask,
  useWallet,
  useWalletConnect,
} from "../../contexts/WalletContext";
import { useUser } from "../../contexts/UserContext";
import Eggs from "./Eggs";
import LoginButton from "../../components/Button/LoginButton";
import LogoutButton from "../../components/Button/LogoutButton";

export default function Wallet() {
  const wallet = useWallet();
  const user = useUser();
  const { metamaskConnect, isConnected } = useMetaMask();
  const { startProvider } = useWalletConnect();

  return (
    <div className="wallet__root">
      <div className="wallet__container">
        <div className="wallet__user-info">
          <div className="wallet__address">{wallet.address}</div>
          <div className="wallet__phone">
            <div>{user.phone}</div>
            <div style={{ padding: 10, textAlign: "center" }}>
              {user.uid && <LogoutButton size="xs" />}
            </div>
          </div>
        </div>
        {!isConnected && (
          <div style={{ textAlign: "center", margin: 20 }}>
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
        <div
          style={{
            fontWeight: "bold",
            letterSpacing: 5,
            textAlign: "center",
            fontSize: "1.5rem",
          }}
        >
          yaytsos
        </div>
        {user.uid && <Eggs wallet={wallet} />}
        {!user.uid && (
          <div>
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}
