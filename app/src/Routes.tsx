import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Map from "./containers/Map";
import Wallet from "./containers/Wallet";
import Egg from "./containers/Egg";
import { ThreeProvider } from "./contexts/ThreeContext";
import { PatternProvider } from "./contexts/PatternContext";
import { WalletProvider } from "./contexts/WalletContext";
import { ContractProvider } from "./contexts/ContractContext";
import Nav from "./components/Nav";

export default function Routes() {
  return (
    <Router>
      <Nav />
      <Switch>
        <Route path="/wallet">
          <WalletProvider>
            <ContractProvider>
              <Wallet />
            </ContractProvider>
          </WalletProvider>
        </Route>
        <Route path="/map" component={Map} />
        <Route path="/">
          <PatternProvider>
            <ThreeProvider>
              <Egg />
            </ThreeProvider>
          </PatternProvider>
        </Route>
      </Switch>
    </Router>
  );
}
