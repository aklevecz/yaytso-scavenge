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
        <Route path="/wallet">
          <WalletProvider>
            <Wallet />
          </WalletProvider>
        </Route>
        <Route path="/egg">
          <PatternProvider>
            <ThreeProvider>
              <Egg />
            </ThreeProvider>
          </PatternProvider>
        </Route>
        <Route path="/" component={Map} />
      </Switch>
    </Router>
  );
}
