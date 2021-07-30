import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Map from "./containers/Map";
import Wallet from "./containers/Wallet";
import Egg from "./containers/Egg";
import { ThreeProvider } from "./contexts/ThreeContext";

export default function Routes() {
  return (
    <Router>
      <Switch>
        <Route path="/wallet" component={Wallet} />
        <ThreeProvider>
          <Route path="/egg" component={Egg} />
        </ThreeProvider>
        <Route path="/" component={Map} />
      </Switch>
    </Router>
  );
}
