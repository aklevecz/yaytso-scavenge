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
import { WalletTypes } from "../../contexts/types";

export default function Wallet() {
  const { wallet, disconnect } = useWallet();
  const user = useUser();
  const { metamaskConnect, isConnected } = useMetaMask();
  const { startProvider } = useWalletConnect();

  return (
    <div className="wallet__root">
      <div className="wallet__container">
        <div className="wallet__user-info">
          {wallet.connected && (
            <div className="wallet__address">
              <div>{wallet.address}</div>
              {wallet.eth &&
                wallet.eth.walletType === WalletTypes.WalletConnect && (
                  <Button
                    size="xs"
                    width="100%"
                    margin="10px 0"
                    name="Disconnect"
                    onClick={disconnect}
                  />
                )}
            </div>
          )}
          <div className="wallet__phone">
            <div>{user.phone}</div>
            <div style={{ padding: 10, textAlign: "center" }}>
              {user.uid && <LogoutButton size="xs" />}
            </div>
          </div>
        </div>
        {!isConnected && (
          <div
            className="wallet__connect-container"
            style={{ textAlign: "center", margin: 20 }}
          >
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

        {user.uid && <Eggs wallet={wallet} />}
        {!user.uid && (
          <div
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              textAlign: "center",
              flexDirection: "column",
              marginTop: "10%",
              fontWeight: "bold",
            }}
          >
            <div style={{ marginBottom: 20, fontSize: "1.3rem", width: "80%" }}>
              You must login to view your collection!
            </div>
            <LoginButton />
          </div>
        )}
      </div>
    </div>
  );
}
