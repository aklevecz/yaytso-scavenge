import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Map from "./containers/Map";
import Wallet from "./containers/Wallet";
import Egg from "./containers/Egg";
import { ThreeProvider } from "./contexts/ThreeContext";
import { PatternProvider } from "./contexts/PatternContext";
import { WalletProvider } from "./contexts/WalletContext";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <WalletProvider>
          <Route path="/wallet" component={Wallet} />
        </WalletProvider>
        <PatternProvider>
          <ThreeProvider>
            <Route path="/egg" component={Egg} />
          </ThreeProvider>
        </PatternProvider>
        <Route path="/" component={Map} />
      </Switch>
    </Router>
  );
}
