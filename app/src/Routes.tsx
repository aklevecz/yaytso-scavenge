import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Map from "./containers/Map";
import Wallet from "./containers/Wallet";
import Overlay from "./containers/Overlay";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/wallet" component={Wallet} />
        <Route path="/" component={Map} />
      </Switch>
    </Router>
  );
}
